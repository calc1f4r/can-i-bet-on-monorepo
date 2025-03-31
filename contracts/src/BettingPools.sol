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

    enum TokenType {
        USDC,
        POINTS
    }

    // Structs
    struct Pool {
        uint256 id; // Incremental id
        string question; // Bet question
        string[2] options; // Bet options
        uint40 betsCloseAt; // Time at which no more bets can be placed
        uint40 decisionTime; // Time in which we knew the outcome of the bet. If this happens while bets are open, bets made on or after this time are void and refunded
        uint256[2] usdcBetTotals; // Total amount bet on each option for USDC [optionIndex]. Must align with options array
        uint256[2] pointsBetTotals; // Total amount bet on each option for POINTS [optionIndex]. Must align with options array
        uint256[] betIds; // Array of ids for user bets
        mapping(address => Bet[2]) usdcBetsByUser; // Mapping from user address to their USDC bets. Bets for option
        mapping(address => Bet[2]) pointsBetsByUser; // Mapping from user address to their Points bets. Bets for option
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
        uint256 amount; // Amount bet
        uint256 poolId; // Id of the pool the bet belongs to
        uint256 createdAt; // Time at which the bet was initially created
        uint256 updatedAt; // Time which bet was updated (ie: if a user added more money to their bet)
        bool isPayedOut; // Whether the bet has been paid out by Chainlink Automation
        BetOutcome outcome; // How the bet was resolved (NONE, WON, LOST, VOIDED, DRAW)
        TokenType tokenType; // Type of token used for the bet
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
        keccak256("Bet(uint256 poolId,uint256 optionIndex,uint256 amount,address bettor,uint8 tokenType)");

    uint256 public constant PAYOUT_FEE_BP = 90; // 0.9% fee for the payout

    // State
    ERC20Permit public usdc;
    ERC20Permit public betPoints;

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
        uint256 indexed betId,
        uint256 indexed poolId,
        address indexed user,
        uint256 optionIndex,
        uint256 amount,
        TokenType tokenType
    );
    event TwitterPostIdSet(uint256 indexed poolId, string twitterPostId);
    event PayoutClaimed(
        uint256 indexed betId,
        uint256 indexed poolId,
        address indexed user,
        uint256 amount,
        BetOutcome resolution,
        TokenType tokenType
    );

    constructor(address _usdc, address _betPoints) Ownable(msg.sender) {
        usdc = ERC20Permit(_usdc);
        betPoints = ERC20Permit(_betPoints);
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
        pool.usdcBetTotals = [0, 0];
        pool.pointsBetTotals = [0, 0];
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
        TokenType tokenType,
        uint256 permitDeadline,
        Signature calldata permitSignature
    ) external returns (uint256 betId) {
        if (block.timestamp > pools[poolId].betsCloseAt) revert BettingPeriodClosed();
        if (pools[poolId].status != PoolStatus.PENDING) revert PoolNotOpen();
        if (optionIndex >= 2) revert InvalidOptionIndex();
        if (amount <= 0) revert ZeroAmount();

        ERC20Permit token = tokenType == TokenType.USDC ? usdc : betPoints;
        if (token.balanceOf(bettor) < amount) revert InsufficientBalance();

        token.permit(
            bettor, address(this), amount, permitDeadline, permitSignature.v, permitSignature.r, permitSignature.s
        );
        token.transferFrom(bettor, address(this), amount);

        betId = tokenType == TokenType.USDC 
            ? pools[poolId].usdcBetsByUser[bettor][optionIndex].id 
            : pools[poolId].pointsBetsByUser[bettor][optionIndex].id;
            
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
                outcome: BetOutcome.NONE,
                tokenType: tokenType
            });
            bets[betId] = newBet;
            pools[poolId].betIds.push(betId);
            userBets[bettor].push(betId);
            if (tokenType == TokenType.USDC) {
                pools[poolId].usdcBetsByUser[bettor][optionIndex] = newBet;
            } else {
                pools[poolId].pointsBetsByUser[bettor][optionIndex] = newBet;
            }
        } else {
            if (tokenType == TokenType.USDC) {
                pools[poolId].usdcBetsByUser[bettor][optionIndex].amount += amount;
                pools[poolId].usdcBetsByUser[bettor][optionIndex].updatedAt = block.timestamp;
            } else {
                pools[poolId].pointsBetsByUser[bettor][optionIndex].amount += amount;
                pools[poolId].pointsBetsByUser[bettor][optionIndex].updatedAt = block.timestamp;
            }
        }

        if (tokenType == TokenType.USDC) {
            pools[poolId].usdcBetTotals[optionIndex] += amount;
        } else {
            pools[poolId].pointsBetTotals[optionIndex] += amount;
        }

        emit BetPlaced(betId, poolId, bettor, optionIndex, amount, tokenType);
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
            TokenType tokenType = bets[betId].tokenType;
            ERC20Permit token = tokenType == TokenType.USDC ? usdc : betPoints;

            // Check if bet was placed after or on decisionTime and should be voided
            if (pools[poolId].decisionTime > 0 && bets[betId].createdAt >= pools[poolId].decisionTime) {
                bets[betId].outcome = BetOutcome.VOIDED;
                token.transfer(bets[betId].owner, bets[betId].amount);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, bets[betId].amount, BetOutcome.VOIDED, tokenType);
                continue;
            }

            uint256[2] storage betTotals =
                tokenType == TokenType.USDC ? pools[poolId].usdcBetTotals : pools[poolId].pointsBetTotals;

            // If it is a draw or there are no bets on one side or the other, refund the bet
            if (pools[poolId].isDraw || betTotals[0] == 0 || betTotals[1] == 0) {
                BetOutcome resolution = pools[poolId].isDraw ? BetOutcome.DRAW : BetOutcome.VOIDED;

                bets[betId].outcome = resolution;
                token.transfer(bets[betId].owner, bets[betId].amount);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, bets[betId].amount, resolution, tokenType);
                continue;
            }

            uint256 losingOption = pools[poolId].winningOption == 0 ? 1 : 0;

            if (bets[betId].option == pools[poolId].winningOption) {
                bets[betId].outcome = BetOutcome.WON;
                uint256 winAmount = (bets[betId].amount * betTotals[losingOption])
                    / betTotals[pools[poolId].winningOption] + bets[betId].amount;
                uint256 fee = (winAmount * PAYOUT_FEE_BP) / 10000;
                uint256 payout = winAmount - fee;
                token.transfer(bets[betId].owner, payout);
                token.transfer(owner(), fee);
                emit PayoutClaimed(betId, poolId, bets[betId].owner, payout, BetOutcome.WON, tokenType);
            } else {
                bets[betId].outcome = BetOutcome.LOST;
                emit PayoutClaimed(betId, poolId, bets[betId].owner, 0, BetOutcome.LOST, tokenType);
            }
        }
    }
}
