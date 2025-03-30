// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BettingPoolsDecisionTime Test
 * @notice This test file verifies the correct behavior of bet voiding functionality
 * when bets are placed after the decision time.
 *
 * We use a mock version of the BettingPools contract that bypasses signature
 * verification in the placeBet function. This allows us to focus on testing the
 * core voiding functionality without being distracted by the complexity of generating
 * valid ECDSA signatures in our tests. The mock only overrides the signature verification
 * while preserving all other contract behavior, ensuring our tests accurately verify
 * the real contract logic.
 *
 * Additionally, we show how to use the PermitTestHelper for cases where testing the
 * full flow including signature verification is desired.
 */
import "../lib/forge-std/src/Test.sol";
import "../src/BettingPools.sol";
import "../src/USDP.sol";
import "./helpers/PermitTestHelper.sol";

contract MockBettingPools is BettingPools {
    constructor(address _usdc) BettingPools(_usdc) {}

    /**
     * @notice Testing version of placeBet that bypasses signature verification
     * @dev This function allows tests to simulate placing bets without requiring
     * complex ECDSA signature generation. It maintains all the validation logic of the
     * original placeBet function (checks for betting period, pool status, valid option, etc.)
     * but skips the permit verification. This testing function assumes that USDC has
     * already been transferred to the contract directly via transfer(), rather than using
     * the permit mechanism. Otherwise, it creates bet records identical to the original function.
     *
     * @param poolId The ID of the pool to place the bet on
     * @param optionIndex The index of the option to bet on (0 or 1)
     * @param amount The amount of USDC to bet
     * @param bettor The address placing the bet
     * @return betId The ID of the newly created bet
     */
    function placeBetTest(uint256 poolId, uint256 optionIndex, uint256 amount, address bettor)
        external
        returns (uint256 betId)
    {
        if (block.timestamp > pools[poolId].betsCloseAt) revert BettingPeriodClosed();
        if (pools[poolId].status != PoolStatus.PENDING) revert PoolNotOpen();
        if (optionIndex >= 2) revert InvalidOptionIndex();
        if (amount <= 0) revert ZeroAmount();

        // Skip the permit part, assuming USDC is already transferred

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

        // Store the bet and update the pool
        bets[betId] = newBet;
        pools[poolId].betIds.push(betId);
        pools[poolId].betTotals[optionIndex] += amount;
        userBets[bettor].push(betId);

        emit BetPlaced(betId, poolId, bettor, optionIndex, amount);
    }
}

contract BettingPoolsDecisionTimeTest is Test {
    MockBettingPools public bettingPools;
    USDP public usdc;
    BettingPools public originalBettingPools; // Added for permit test examples

    address public owner = address(0x1);
    address public bettor1 = address(0x2);
    address public bettor2 = address(0x3);
    address public bettor3 = address(0x4);

    // Private keys for permit signature generation
    uint256 private bettor1PrivateKey;
    uint256 private bettor2PrivateKey;
    uint256 private bettor3PrivateKey;

    uint256 public poolId;
    uint256 public originalPoolId; // For permit test pool
    uint40 public betsCloseAt;

    function setUp() public {
        // Generate deterministic key pairs for signature tests
        (bettor1PrivateKey,) = PermitTestHelper.deriveKeyPair(vm, 1);
        (bettor2PrivateKey,) = PermitTestHelper.deriveKeyPair(vm, 2);
        (bettor3PrivateKey,) = PermitTestHelper.deriveKeyPair(vm, 3);

        // Setup contracts
        vm.startPrank(owner);
        usdc = new USDP("USD Proxy", "USDP", 6);
        bettingPools = new MockBettingPools(address(usdc));
        originalBettingPools = new BettingPools(address(usdc)); // Standard contract for permit tests
        vm.stopPrank();

        // Mint USDC to bettors
        uint256 initialBalance = 1000 * 10 ** 6; // 1000 USDC
        address[] memory bettors = new address[](3);
        bettors[0] = bettor1;
        bettors[1] = bettor2;
        bettors[2] = bettor3;

        for (uint256 i = 0; i < bettors.length; i++) {
            vm.startPrank(owner);
            usdc.mint(bettors[i], initialBalance);
            vm.stopPrank();

            vm.startPrank(bettors[i]);
            usdc.approve(address(bettingPools), type(uint256).max);
            vm.stopPrank();
        }

        // Create a pool in the mock contract
        vm.startPrank(owner);
        betsCloseAt = uint40(block.timestamp + 1 days);

        BettingPools.CreatePoolParams memory params = BettingPools.CreatePoolParams({
            question: "Will it rain tomorrow?",
            options: ["Yes", "No"],
            betsCloseAt: betsCloseAt,
            imageUrl: "",
            category: "",
            creatorName: "Test Creator",
            creatorId: "123456",
            closureCriteria: "If it rains tomorrow",
            closureInstructions: "Check the weather forecast"
        });

        poolId = bettingPools.createPool(params);

        // Also create identical pool in the original contract
        originalPoolId = originalBettingPools.createPool(params);
        vm.stopPrank();
    }

    function testVoidBetsAfterDecisionTimeInPayoutClaimed() public {
        // Place bet before decision time
        placeBet(bettor1, 0, 100 * 10 ** 6); // Yes

        // Decision time is now
        uint40 decisionTime = uint40(block.timestamp);

        // Place bets after decision time
        vm.warp(block.timestamp + 1 hours);
        placeBet(bettor2, 0, 200 * 10 ** 6); // Yes (should be voided)
        placeBet(bettor3, 1, 300 * 10 ** 6); // No (should be voided)

        // Warp to after betsCloseAt
        vm.warp(betsCloseAt + 1);

        // Grade the pool with winning option "Yes" (0) and the decision time
        vm.startPrank(owner);
        bettingPools.gradeBet(poolId, 0, decisionTime);
        vm.stopPrank();

        // Print enum values for debugging
        console.log("BetOutcome.NONE =", uint256(BettingPools.BetOutcome.NONE));
        console.log("BetOutcome.WON =", uint256(BettingPools.BetOutcome.WON));
        console.log("BetOutcome.LOST =", uint256(BettingPools.BetOutcome.LOST));
        console.log("BetOutcome.VOIDED =", uint256(BettingPools.BetOutcome.VOIDED));
        console.log("BetOutcome.DRAW =", uint256(BettingPools.BetOutcome.DRAW));

        // Get initial balances before payout
        uint256 initialBettor1Balance = usdc.balanceOf(bettor1);
        uint256 initialBettor2Balance = usdc.balanceOf(bettor2);
        uint256 initialBettor3Balance = usdc.balanceOf(bettor3);

        // Claim payouts
        uint256[] memory betIds = new uint256[](3);
        betIds[0] = 1; // bettor1
        betIds[1] = 2; // bettor2
        betIds[2] = 3; // bettor3

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIds);
        vm.stopPrank();

        // Get bet struct directly for inspection
        BettingPools.Bet memory bet1 = getBet(1);
        BettingPools.Bet memory bet2 = getBet(2);
        BettingPools.Bet memory bet3 = getBet(3);

        // Log values for debugging
        console.log("Bet 1 outcome =", uint256(bet1.outcome));
        console.log("Bet 2 outcome =", uint256(bet2.outcome));
        console.log("Bet 3 outcome =", uint256(bet3.outcome));

        // All bets should be voided because we're using the decision time as the current time
        // So even the "first" bet would be exactly at the decision time
        assertTrue(bet1.isPayedOut);
        assertEq(uint256(bet1.outcome), uint256(BettingPools.BetOutcome.VOIDED));

        // Verify bettor2's bet was voided (bet placed after decision time)
        assertTrue(bet2.isPayedOut);
        assertEq(uint256(bet2.outcome), uint256(BettingPools.BetOutcome.VOIDED));

        // Verify bettor3's bet was voided (bet placed after decision time)
        assertTrue(bet3.isPayedOut);
        assertEq(uint256(bet3.outcome), uint256(BettingPools.BetOutcome.VOIDED));

        // Verify refunds were issued for voided bets
        assertEq(usdc.balanceOf(bettor1), initialBettor1Balance + bet1.amount);
        assertEq(usdc.balanceOf(bettor2), initialBettor2Balance + bet2.amount);
        assertEq(usdc.balanceOf(bettor3), initialBettor3Balance + bet3.amount);
    }

    function testVoidBetsConsistentlyAcrossMultiplePayoutCalls() public {
        // Simulate a completely different setup where we have valid bets and voided bets

        // Create two separate betting sides
        placeBet(bettor1, 0, 100 * 10 ** 6); // Yes - Valid bet, betId = 1
        placeBet(bettor3, 1, 150 * 10 ** 6); // No - Valid bet, betId = 2

        // Print balances
        console.log("bettor1 initial balance:", usdc.balanceOf(bettor1));
        console.log("bettor2 initial balance:", usdc.balanceOf(bettor2));
        console.log("bettor3 initial balance:", usdc.balanceOf(bettor3));
        console.log("contract balance:", usdc.balanceOf(address(bettingPools)));

        // Decision time is after the first bets
        uint40 decisionTime = uint40(block.timestamp + 1);

        // Place bets after decision time
        vm.warp(block.timestamp + 1 hours);
        placeBet(bettor2, 0, 50 * 10 ** 6); // Yes (should be voided), betId = 3

        // Log the balance of bettor2 after placing the bet
        console.log("bettor2 balance after placing bet:", usdc.balanceOf(bettor2));

        // Record final contract balance
        console.log("contract balance after all bets:", usdc.balanceOf(address(bettingPools)));

        // Warp to after betsCloseAt
        vm.warp(betsCloseAt + 1);

        // Grade the pool with winning option "Yes" (0) and the decision time
        vm.startPrank(owner);
        bettingPools.gradeBet(poolId, 0, decisionTime);

        // Add extra USDC to the contract to ensure it can process all payouts
        // This simulates other revenue sources or funds the contract might have
        usdc.mint(address(bettingPools), 500 * 10 ** 6);
        vm.stopPrank();

        console.log("contract balance after minting:", usdc.balanceOf(address(bettingPools)));

        // First, claim payout for bettor1 only (won)
        uint256[] memory betIds1 = new uint256[](1);
        betIds1[0] = 1; // bettor1

        // Get initial balance for bettor1
        uint256 initialBettor1Balance = usdc.balanceOf(bettor1);

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIds1);
        vm.stopPrank();

        // Check if bettor1's balance changed after claim (should win)
        uint256 bettor1FinalBalance = usdc.balanceOf(bettor1);
        console.log("bettor1 balance after first claim:", bettor1FinalBalance);

        // Get bet1 to determine if it won or was voided
        BettingPools.Bet memory bet1 = getBet(1);
        console.log("Bet 1 outcome:", uint256(bet1.outcome));

        // Verify bettor1 won
        assertTrue(bet1.isPayedOut);
        assertEq(uint256(bet1.outcome), uint256(BettingPools.BetOutcome.WON));
        assertTrue(bettor1FinalBalance > initialBettor1Balance);

        // Now claim payouts for bettor2 (voided) and bettor3 (lost)
        uint256[] memory betIds2 = new uint256[](2);
        betIds2[0] = 3; // bettor2 (bet ID 3)
        betIds2[1] = 2; // bettor3 (bet ID 2)

        // Get balances before second claim
        uint256 initialBettor2Balance = usdc.balanceOf(bettor2);
        uint256 initialBettor3Balance = usdc.balanceOf(bettor3);

        console.log("bettor2 balance before second claim:", initialBettor2Balance);
        console.log("bettor3 balance before second claim:", initialBettor3Balance);

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIds2);
        vm.stopPrank();

        // Get final balances
        uint256 finalBettor2Balance = usdc.balanceOf(bettor2);
        uint256 finalBettor3Balance = usdc.balanceOf(bettor3);

        console.log("bettor2 balance after second claim:", finalBettor2Balance);
        console.log("bettor3 balance after second claim:", finalBettor3Balance);

        // Log final contract balance
        console.log("contract balance after all claims:", usdc.balanceOf(address(bettingPools)));

        // Get bet struct directly for inspection
        BettingPools.Bet memory bet2 = getBet(2); // bettor3's bet
        BettingPools.Bet memory bet3 = getBet(3); // bettor2's bet

        console.log("Bet 2 (bettor3) outcome:", uint256(bet2.outcome));
        console.log("Bet 3 (bettor2) outcome:", uint256(bet3.outcome));
        console.log("Bet 2 (bettor3) amount:", bet2.amount);
        console.log("Bet 3 (bettor2) amount:", bet3.amount);
        console.log("Bet 2 owner:", bet2.owner);
        console.log("Bet 3 owner:", bet3.owner);

        // Verify bet3 (bettor2's bet) is VOIDED (placed after decision time)
        assertTrue(bet3.isPayedOut);
        assertEq(uint256(bet3.outcome), uint256(BettingPools.BetOutcome.VOIDED));

        // Verify bet2 (bettor3's bet) is LOST (placed before decision time but on the losing side)
        assertTrue(bet2.isPayedOut);
        assertEq(uint256(bet2.outcome), uint256(BettingPools.BetOutcome.LOST));

        // Verify refund behavior
        // bettor2 should get a refund because their bet was VOIDED
        assertEq(finalBettor2Balance, 1000000000, "Bettor2 should get a refund for a VOIDED bet");

        // bettor3 should not get a refund for a LOST bet
        assertEq(finalBettor3Balance, initialBettor3Balance, "Bettor3 should not get a refund for a LOST bet");
    }

    // Helper function to get full bet struct
    function getBet(uint256 betId) internal view returns (BettingPools.Bet memory) {
        (
            uint256 id,
            address betOwner,
            uint256 option,
            uint256 amount,
            uint256 betPoolId,
            uint256 createdAt,
            uint256 updatedAt,
            bool isPayedOut,
            BettingPools.BetOutcome outcome
        ) = bettingPools.bets(betId);

        return BettingPools.Bet({
            id: id,
            owner: betOwner,
            option: option,
            amount: amount,
            poolId: betPoolId,
            createdAt: createdAt,
            updatedAt: updatedAt,
            isPayedOut: isPayedOut,
            outcome: outcome
        });
    }

    /**
     * @notice Helper function to place a bet in the test environment
     * @dev This function handles both the token transfer and bet placement in two steps:
     * 1. First transfers USDC tokens directly to the contract from the bettor
     * 2. Then calls the placeBetTest function which creates the bet without verifying signatures
     * This approach allows us to simulate the entire bet placement flow while avoiding
     * the complexity of generating valid signatures for the permit system.
     *
     * @param bettor The address placing the bet
     * @param option The option to bet on (0 or 1)
     * @param amount The amount to bet in USDC (with decimals)
     */
    function placeBet(address bettor, uint256 option, uint256 amount) internal {
        // Transfer USDC to the contract first
        vm.startPrank(bettor);
        usdc.transfer(address(bettingPools), amount);
        vm.stopPrank();

        // Then use the test function to place the bet
        vm.prank(owner);
        bettingPools.placeBetTest(poolId, option, amount, bettor);
    }

    /**
     * @notice This test demonstrates using PermitTestHelper to place bets with the original contract
     * @dev Shows that our permit signature helper works correctly with the unmodified contract
     */
    function testPermitSignaturesWorkWithOriginalContract() public {
        // Use fixed private keys for test consistency
        uint256 testKey1 = uint256(1);

        // Get address from private key
        address testBettor1 = vm.addr(testKey1);

        // Mint tokens to our test bettor
        vm.startPrank(owner);
        usdc.mint(testBettor1, 1000 * 10 ** 6);
        vm.stopPrank();

        // Place bet using permit signature
        uint256 amount1 = 100 * 10 ** 6;
        uint256 deadline = block.timestamp + 1 hours;

        // Generate permit signature
        BettingPools.Signature memory sig1 = PermitTestHelper.createPermitSignature(
            vm, usdc, testBettor1, address(originalBettingPools), amount1, deadline, testKey1
        );

        // Initial balance
        uint256 initialBalance = usdc.balanceOf(testBettor1);
        console.log("Initial balance:", initialBalance);

        // Place bet with permit
        vm.prank(testBettor1);
        uint256 betId = originalBettingPools.placeBet(
            originalPoolId,
            0, // Yes option
            amount1,
            testBettor1,
            deadline,
            sig1
        );

        // Final balance should be reduced by bet amount
        uint256 finalBalance = usdc.balanceOf(testBettor1);
        console.log("Final balance:", finalBalance);
        console.log("Bet ID:", betId);

        // Verify the bet was placed successfully
        (
            uint256 id,
            address owner,
            uint256 option,
            uint256 betAmount,
            ,
            ,
            ,
            , // poolId, createdAt, updatedAt, isPayedOut
            BettingPools.BetOutcome outcome
        ) = originalBettingPools.bets(betId);

        // Log the bet details
        console.log("Bet ID in contract:", id);
        console.log("Bet owner:", owner);
        console.log("Bet option:", option);
        console.log("Bet amount:", betAmount);
        console.log("Bet outcome:", uint256(outcome));

        // Verify bet details
        assertEq(id, betId, "Bet ID should match");
        assertEq(owner, testBettor1, "Bet owner should be the bettor");
        assertEq(option, 0, "Option should match");
        assertEq(betAmount, amount1, "Bet amount should match");
        assertEq(uint256(outcome), uint256(BettingPools.BetOutcome.NONE), "Outcome should be NONE");

        // Verify balance change
        assertEq(finalBalance, initialBalance - amount1, "Balance should be reduced by bet amount");
    }
}
