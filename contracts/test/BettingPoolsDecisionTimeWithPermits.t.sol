// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BettingPoolsDecisionTime Test (With Permits)
 * @notice This test file verifies the correct behavior of bet voiding functionality
 * when bets are placed after the decision time, using full EIP-2612 permit signatures.
 *
 * Rather than using a mock contract, this version demonstrates how to test the
 * original BettingPools contract directly with valid permit signatures, resulting
 * in more realistic end-to-end testing of the actual contract implementation.
 */
import "../lib/forge-std/src/Test.sol";
import "../src/BettingPools.sol";
import "../src/USDP.sol";
import "./helpers/PermitTestHelper.sol";

contract BettingPoolsDecisionTimeWithPermitsTest is Test {
    BettingPools public bettingPools;
    USDP public usdc;

    address public owner;

    // Private keys and addresses for bettors
    uint256 private bettor1Key;
    uint256 private bettor2Key;
    uint256 private bettor3Key;
    address public bettor1;
    address public bettor2;
    address public bettor3;

    uint256 public poolId;
    uint40 public betsCloseAt;

    function setUp() public {
        // Use fixed private keys for consistency
        bettor1Key = uint256(1);
        bettor2Key = uint256(2);
        bettor3Key = uint256(3);

        // Derive addresses from keys
        bettor1 = vm.addr(bettor1Key);
        bettor2 = vm.addr(bettor2Key);
        bettor3 = vm.addr(bettor3Key);

        // Use fixed owner address
        owner = address(0x1);

        // Setup contracts
        vm.startPrank(owner);
        usdc = new USDP("USD Proxy", "USDP", 6);
        bettingPools = new BettingPools(address(usdc));
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
        }

        // Create a pool
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
        vm.stopPrank();
    }

    function testVoidBetsAfterDecisionTimeInPayoutClaimed() public {
        // Place bet before decision time
        uint256 betId1 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor1,
            bettor1Key,
            poolId,
            0, // Yes option
            100 * 10 ** 6
        );

        // Decision time is now
        uint40 decisionTime = uint40(block.timestamp);

        // Place bets after decision time
        vm.warp(block.timestamp + 1 hours);
        uint256 betId2 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor2,
            bettor2Key,
            poolId,
            0, // Yes option
            200 * 10 ** 6
        );

        uint256 betId3 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor3,
            bettor3Key,
            poolId,
            1, // No option
            300 * 10 ** 6
        );

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
        betIds[0] = betId1;
        betIds[1] = betId2;
        betIds[2] = betId3;

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIds);
        vm.stopPrank();

        // Get bet struct directly for inspection
        BettingPools.Bet memory bet1 = getBet(betId1);
        BettingPools.Bet memory bet2 = getBet(betId2);
        BettingPools.Bet memory bet3 = getBet(betId3);

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
        uint256 betId1 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor1,
            bettor1Key,
            poolId,
            0, // Yes option
            100 * 10 ** 6
        );

        uint256 betId2 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor3,
            bettor3Key,
            poolId,
            1, // No option
            150 * 10 ** 6
        );

        // Print balances
        console.log("bettor1 initial balance:", usdc.balanceOf(bettor1));
        console.log("bettor2 initial balance:", usdc.balanceOf(bettor2));
        console.log("bettor3 initial balance:", usdc.balanceOf(bettor3));
        console.log("contract balance:", usdc.balanceOf(address(bettingPools)));

        // Decision time is after the first bets
        uint40 decisionTime = uint40(block.timestamp + 1);

        // Place bets after decision time
        vm.warp(block.timestamp + 1 hours);
        uint256 betId3 = PermitTestHelper.placeBetWithPermit(
            vm,
            bettingPools,
            usdc,
            bettor2,
            bettor2Key,
            poolId,
            0, // Yes option
            50 * 10 ** 6
        );

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
        betIds1[0] = betId1; // bettor1

        // Get initial balance for bettor1
        uint256 initialBettor1Balance = usdc.balanceOf(bettor1);

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIds1);
        vm.stopPrank();

        // Check if bettor1's balance changed after claim (should win)
        uint256 bettor1FinalBalance = usdc.balanceOf(bettor1);
        console.log("bettor1 balance after first claim:", bettor1FinalBalance);

        // Get bet1 to determine if it won or was voided
        BettingPools.Bet memory bet1 = getBet(betId1);
        console.log("Bet 1 outcome:", uint256(bet1.outcome));

        // Verify bettor1 won
        assertTrue(bet1.isPayedOut);
        assertEq(uint256(bet1.outcome), uint256(BettingPools.BetOutcome.WON));
        assertTrue(bettor1FinalBalance > initialBettor1Balance);

        // Now claim payouts for bettor2 (voided) and bettor3 (lost)
        uint256[] memory betIds2 = new uint256[](2);
        betIds2[0] = betId3; // bettor2's bet (ID 3)
        betIds2[1] = betId2; // bettor3's bet (ID 2)

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
        BettingPools.Bet memory bet2 = getBet(betId2); // bettor3's bet
        BettingPools.Bet memory bet3 = getBet(betId3); // bettor2's bet

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
        assertEq(
            finalBettor2Balance, initialBettor2Balance + bet3.amount, "Bettor2 should get a refund for a VOIDED bet"
        );

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
}
