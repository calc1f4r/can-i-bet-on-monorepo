// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20Permit} from "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ECDSA} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract BettingPools is Ownable {
    // Enums
    enum PoolStatus {
        NONE,
        PENDING,
        GRADED,
        REGRADED //Disputed (unused for now)

    }
    enum BetOutcome {
        NONE,
        WON,
        LOST,
        VOIDED,
        DRAW
    }

    // Structs
    struct Pool {
        uint256 id; // Incremental id
        string question; // Bet question
        string[2] options; // Bet options
        uint40 betsCloseAt; // Time at which no more bets can be placed
        uint40 decisionTime; // Time in which we knew the outcome of the bet. If this happens while bets are open, bets made on or after this time are void and refunded
        uint256[2] betTotals; // Total amount of money bet on each option
        uint256[] betIds; // Array of ids for user bets
        mapping(address => Bet[2]) betsByUser; // Mapping from user address to their bets. Bets for option
        uint256 winningOption; // Option that won the bet (0 or 1) (only matters if status is GRADED)
        PoolStatus status; // Status of the bet
        bool isDraw; // Indicates if the bet is a push (no winner and betters are refunded)
        uint256 createdAt; // Time at which the bet was created
        string imageUrl; // UNUSED
        string category; // UNUSED
        string creatorName; // Username of Telegram user who created the bet
        string creatorId; // Telegram id of user who created the bet
        string closureCriteria; // Criteria for WHEN a bet should be graded
        string closureInstructions; // Instructions for HOW to decide which option won
        string twitterPostId; // Twitter post id of the bet
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct Bet {
        uint256 id; // Incremental id
        address owner; // Address of user who made the bet
        uint256 option; // Option that the user bet on (0 or 1)
        uint256 amount; // Amount of USDC bet
        uint256 poolId; // Id of the pool the bet belongs to
        uint256 createdAt; // Time at which the bet was initially created
        uint256 updatedAt; // Time which bet was updated (ie: if a user added more money to their bet)
        bool isPayedOut; // Whether the bet has been paid out by Chainlink Automation
        BetOutcome outcome; // How the bet was resolved (NONE, WON, LOST, VOIDED, DRAW)
    }

    struct CreatePoolParams {
        string question;
        string[2] options;
        uint40 betsCloseAt;
        string imageUrl;
        string category;
        string creatorName;
        string creatorId;
        string closureCriteria;
        string closureInstructions;
    }

    bytes32 public constant BET_TYPEHASH =
        keccak256("Bet(uint256 poolId,uint256 optionIndex,uint256 amount,address bettor)");

    uint256 public constant PAYOUT_FEE_BP = 90; // 0.9% fee for the payout

    // State
    ERC20Permit public usdc;

    uint256 public nextPoolId = 1;
    uint256 public nextBetId = 1;

    mapping(uint256 poolId => Pool pool) public pools;

    mapping(uint256 betId => Bet bet) public bets;
    mapping(address bettor => uint256[] betIds) public userBets;

    // Custom Errors
    error BetsCloseTimeInPast();
    error BetsCloseAfterDecision();
    error PoolNotOpen();
    error PoolDoesntExist();
    error BettingPeriodClosed();
    error InvalidOptionIndex();
    error BetAlreadyExists();
    error USDCTransferFailed();
    error NoBetToCancel();
    error USDCRefundFailed();
    error DecisionDateNotReached();
    error PoolAlreadyClosed();
    error ZeroAmount();
    error InsufficientBalance();
    error BettingPeriodNotClosed();
    error PoolNotGraded();
    error GradingError();
    error BetAlreadyPaidOut();
    error NotBetOwner();

    // Events
    event PoolCreated(uint256 poolId, CreatePoolParams params);
    event PoolClosed(uint256 indexed poolId, uint256 selectedOption, uint40 decisionTime);
    event BetPlaced(
        uint256 indexed betId, uint256 indexed poolId, address indexed user, uint256 optionIndex, uint256 amount
    );
    event TwitterPostIdSet(uint256 indexed poolId, string twitterPostId);
    event PayoutClaimed(
        uint256 indexed betId, uint256 indexed poolId, address indexed user, uint256 amount, BetOutcome resolution
    );

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = ERC20Permit(_usdc);
    }

    function createPool(CreatePoolParams calldata params) external onlyOwner returns (uint256 poolId) {
        if (params.betsCloseAt <= block.timestamp) revert BetsCloseTimeInPast();

        poolId = nextPoolId++;

        Pool storage pool = pools[poolId];
        pool.id = poolId;
        pool.question = params.question;
        pool.options = params.options;
        pool.betsCloseAt = params.betsCloseAt;
        pool.decisionTime = 0; // Initially set to 0, will be set when pool is graded
        pool.betTotals = [0, 0];
        pool.betIds = new uint256[](0);
        pool.winningOption = 0;
        pool.status = PoolStatus.PENDING;
        pool.isDraw = false;
        pool.createdAt = block.timestamp;
        pool.imageUrl = params.imageUrl;
        pool.category = params.category;
        pool.creatorName = params.creatorName;
        pool.creatorId = params.creatorId;
        pool.closureCriteria = params.closureCriteria;
        pool.closureInstructions = params.closureInstructions;

        emit PoolCreated(poolId, params);
    }

    function setTwitterPostId(uint256 poolId, string calldata twitterPostId) external onlyOwner {
        if (pools[poolId].status == PoolStatus.NONE) revert PoolDoesntExist();
        pools[poolId].twitterPostId = twitterPostId;
        emit TwitterPostIdSet(poolId, twitterPostId);
    }

    function placeBet(
        uint256 poolId,
        uint256 optionIndex,
        uint256 amount,
        address bettor,
        uint256 usdcPermitDeadline,
        Signature calldata permitSignature
    ) external returns (uint256 betId) {
        if (block.timestamp > pools[poolId].betsCloseAt) revert BettingPeriodClosed();
        if (pools[poolId].status != PoolStatus.PENDING) revert PoolNotOpen();
        if (optionIndex >= 2) revert InvalidOptionIndex();
        if (amount <= 0) revert ZeroAmount();
        if (usdc.balanceOf(bettor) < amount) revert InsufficientBalance();

        usdc.permit(
            bettor, address(this), amount, usdcPermitDeadline, permitSignature.v, permitSignature.r, permitSignature.s
        );
        usdc.transferFrom(bettor, address(this), amount);

        betId = pools[poolId].betsByUser[bettor][optionIndex].id;
        if (betId == 0) {
            // User has not bet on this option before
            betId = nextBetId++;
            Bet memory newBet = Bet({
                id: betId,
                owner: bettor,
                option: optionIndex,
                amount: amount,
                poolId: poolId,
                createdAt: block.timestamp,
                updatedAt: block.timestamp,
                isPayedOut: false,
                outcome: BetOutcome.NONE
            });
            bets[betId] = newBet;
            pools[poolId].betIds.push(betId);
            userBets[bettor].push(betId);
        } else {
            pools[poolId].betsByUser[bettor][optionIndex].amount += amount;
            pools[poolId].betsByUser[bettor][optionIndex].updatedAt = block.timestamp;
        }
        pools[poolId].betTotals[optionIndex] += amount;

        emit BetPlaced(betId, poolId, bettor, optionIndex, amount);
    }

    function gradeBet(uint256 poolId, uint256 responseOption, uint40 decisionTime) external onlyOwner {
        Pool storage pool = pools[poolId];

        if (pool.status != PoolStatus.PENDING) revert PoolNotOpen();
        // if (block.timestamp < pool.betsCloseAt ) revert BettingPeriodNotClosed();

        pool.status = PoolStatus.GRADED;
        pool.decisionTime = decisionTime;

        if (responseOption == 0) {
            pool.winningOption = 0;
        } else if (responseOption == 1) {
            pool.winningOption = 1;
        } else if (responseOption == 2) {
            pool.isDraw = true;
        } else {
            revert("Bet cannot be graded");
        }

        emit PoolClosed(poolId, responseOption, decisionTime);
    }

    function claimPayouts(uint256[] calldata betIds) external {
        for (uint256 i = 0; i < betIds.length; i++) {
            uint256 betId = betIds[i];
            if (pools[bets[betId].poolId].status != PoolStatus.GRADED) continue;
            if (bets[betId].isPayedOut) continue;

            bets[betId].isPayedOut = true;
            uint256 poolId = bets[betId].poolId;

            // Check if bet was placed after or on decisionTime and should be voided
            if (pools[poolId].decisionTime > 0 && bets[betId].createdAt >= pools[poolId].decisionTime) {
                bets[betId].outcome = BetOutcome.VOIDED;
                usdc.transfer(bets[betId].owner, bets[betId].amount);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, bets[betId].amount, BetOutcome.VOIDED);
                continue;
            }

            // If it is a draw or there are no bets on one side or the other, refund the bet
            if (pools[poolId].isDraw || pools[poolId].betTotals[0] == 0 || pools[poolId].betTotals[1] == 0) {
                BetOutcome resolution = pools[poolId].isDraw ? BetOutcome.DRAW : BetOutcome.VOIDED;

                bets[betId].outcome = resolution;
                usdc.transfer(bets[betId].owner, bets[betId].amount);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, bets[betId].amount, resolution);
                continue;
            }

            uint256 losingOption = pools[poolId].winningOption == 0 ? 1 : 0;

            if (bets[betId].option == pools[poolId].winningOption) {
                bets[betId].outcome = BetOutcome.WON;
                uint256 winAmount = (bets[betId].amount * pools[poolId].betTotals[losingOption])
                    / pools[poolId].betTotals[pools[poolId].winningOption] + bets[betId].amount;
                uint256 fee = (winAmount * PAYOUT_FEE_BP) / 10000;
                uint256 payout = winAmount - fee;
                usdc.transfer(bets[betId].owner, payout);
                usdc.transfer(owner(), fee);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, payout, BetOutcome.WON);
            } else {
                bets[betId].outcome = BetOutcome.LOST;
                emit PayoutClaimed(betId, poolId, bets[betId].owner, 0, BetOutcome.LOST);
            }
        }
    }
}
