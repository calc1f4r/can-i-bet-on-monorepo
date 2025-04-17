// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BettingPools.sol";
import "../src/BetPoints.sol";
import "../mocks/MockUSDC.sol";

contract BettingPoolsVoidBetsTest is Test {
    BettingPools public bettingPools;
    MockUSDC public usdc; //TODO This should be ERC20Permit
    BetPoints public betPoints;

    address public owner = address(0x1);
    address public bettor1 = address(0x2);
    address public bettor2 = address(0x3);
    address public bettor3 = address(0x4);
    address public bettor4 = address(0x5);
    address public bettor5 = address(0x6);
    address public bettor6 = address(0x7);
    address public bettor7 = address(0x8);
    address public bettor8 = address(0x9);
    address public bettor9 = address(0x10);
    address public bettor10 = address(0x11);

    uint256 public poolId;
    uint40 public betsCloseAt;
    uint40 public decisionTime;

    function setUp() public {
        // Setup contracts
        vm.startPrank(owner);
        usdc = new MockUSDC("USD Proxy", "USDC", 6);
        betPoints = new BetPoints("USD Proxy", "USDC", 6);
        bettingPools = new BettingPools(address(usdc), address(betPoints));
        vm.stopPrank();

        // Mint USDC to bettors
        uint256 initialBalance = 1000 * 10 ** 6; // 1000 USDC
        address[] memory bettors = new address[](10);
        bettors[0] = bettor1;
        bettors[1] = bettor2;
        bettors[2] = bettor3;
        bettors[3] = bettor4;
        bettors[4] = bettor5;
        bettors[5] = bettor6;
        bettors[6] = bettor7;
        bettors[7] = bettor8;
        bettors[8] = bettor9;
        bettors[9] = bettor10;

        for (uint256 i = 0; i < bettors.length; i++) {
            vm.startPrank(owner);
            usdc.mint(bettors[i], initialBalance);
            vm.stopPrank();

            vm.startPrank(bettors[i]);
            usdc.approve(address(bettingPools), type(uint256).max);
            vm.stopPrank();
        }

        // Create a pool
        vm.startPrank(owner);
        betsCloseAt = uint40(block.timestamp + 1 days);

        BettingPools.CreatePoolParams memory params = BettingPools.CreatePoolParams({
            question: "Will Tucker Carlson tweet about Russia this week?",
            options: ["Yes", "No"],
            betsCloseAt: betsCloseAt,
            imageUrl: "",
            category: "",
            creatorName: "Test Creator",
            creatorId: "123456",
            closureCriteria: "If Tucker Carlson tweets about Russia",
            closureInstructions: "Look at Tucker's Twitter and check for Russia mention"
        });

        poolId = bettingPools.createPool(params);
        vm.stopPrank();
    }

    function testVoidBetsAfterDecisionTime() public {
        // Set decision time to halfway through the betting window
        decisionTime = uint40(block.timestamp + 12 hours);

        // First 5 bettors place bets before decision time (valid bets)
        placeBet(bettor1, 0, 100 * 10 ** 6); // Yes
        placeBet(bettor2, 1, 200 * 10 ** 6); // No
        placeBet(bettor3, 0, 150 * 10 ** 6); // Yes
        placeBet(bettor4, 1, 250 * 10 ** 6); // No
        placeBet(bettor5, 0, 300 * 10 ** 6); // Yes

        // Warp to decision time
        vm.warp(decisionTime);

        // Remaining 5 bettors place bets after decision time (should be voided)
        placeBet(bettor6, 0, 100 * 10 ** 6); // Yes (should be voided)
        placeBet(bettor7, 1, 200 * 10 ** 6); // No (should be voided)
        placeBet(bettor8, 0, 150 * 10 ** 6); // Yes (should be voided)
        placeBet(bettor9, 1, 250 * 10 ** 6); // No (should be voided)
        placeBet(bettor10, 0, 300 * 10 ** 6); // Yes (should be voided)

        // Warp to after betsCloseAt
        vm.warp(betsCloseAt + 1);

        // Grade the pool with winning option "Yes" (0) and the decision time
        vm.startPrank(owner);
        bettingPools.gradeBet(poolId, 0, decisionTime);
        vm.stopPrank();

        // Claim payouts for all bettors
        uint256[] memory betIdsToCheck = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            betIdsToCheck[i] = i + 1; // Bet IDs start from 1
        }

        vm.startPrank(owner);
        bettingPools.claimPayouts(betIdsToCheck);
        vm.stopPrank();

        // Check balances:
        // Bettors 1, 3, 5 should have won (bet "Yes" before decision time)
        // Bettors 2, 4 should have lost (bet "No" before decision time)
        // Bettors 6, 8, 10 should get refunds (bet "Yes" after decision time, but voided)
        // Bettors 7, 9 should get refunds (bet "No" after decision time, but voided)

        // Calculate expected winnings for bettors 1, 3, 5
        uint256 totalYesBetsBeforeDecision = 550 * 10 ** 6; // 100 + 150 + 300
        uint256 totalNoBetsBeforeDecision = 450 * 10 ** 6; // 200 + 250

        // Check bettor1 (Yes, before decision time, should win)
        uint256 bettor1ExpectedWinnings =
            calculateWinnings(100 * 10 ** 6, totalYesBetsBeforeDecision, totalNoBetsBeforeDecision);
        assertApproximatelyEqual(usdc.balanceOf(bettor1), bettor1ExpectedWinnings, 1);

        // Check bettor2 (No, before decision time, should lose)
        assertEq(usdc.balanceOf(bettor2), 800 * 10 ** 6); // 1000 - 200

        // Check bettor3 (Yes, before decision time, should win)
        uint256 bettor3ExpectedWinnings =
            calculateWinnings(150 * 10 ** 6, totalYesBetsBeforeDecision, totalNoBetsBeforeDecision);
        assertApproximatelyEqual(usdc.balanceOf(bettor3), bettor3ExpectedWinnings, 1);

        // Check bettor4 (No, before decision time, should lose)
        assertEq(usdc.balanceOf(bettor4), 750 * 10 ** 6); // 1000 - 250

        // Check bettor5 (Yes, before decision time, should win)
        uint256 bettor5ExpectedWinnings =
            calculateWinnings(300 * 10 ** 6, totalYesBetsBeforeDecision, totalNoBetsBeforeDecision);
        assertApproximatelyEqual(usdc.balanceOf(bettor5), bettor5ExpectedWinnings, 1);

        // Check voided bets (should all get refunded)
        assertEq(usdc.balanceOf(bettor6), 1000 * 10 ** 6); // Full refund
        assertEq(usdc.balanceOf(bettor7), 1000 * 10 ** 6); // Full refund
        assertEq(usdc.balanceOf(bettor8), 1000 * 10 ** 6); // Full refund
        assertEq(usdc.balanceOf(bettor9), 1000 * 10 ** 6); // Full refund
        assertEq(usdc.balanceOf(bettor10), 1000 * 10 ** 6); // Full refund

        // Check if bets are marked as void
        for (uint256 i = 6; i <= 10; i++) {
            (,,,,,,,, BettingPools.BetOutcome outcome,) = bettingPools.bets(i);
            assertTrue(outcome == BettingPools.BetOutcome.VOIDED);
        }

        // Check if bets are not marked as void
        for (uint256 i = 1; i <= 5; i++) {
            (,,,,,,,, BettingPools.BetOutcome outcome,) = bettingPools.bets(i);
            assertFalse(outcome == BettingPools.BetOutcome.VOIDED);
        }
    }

    function placeBet(address bettor, uint256 option, uint256 amount) internal {
        vm.startPrank(bettor);
        BettingPools.Signature memory sig = BettingPools.Signature({v: 0, r: bytes32(0), s: bytes32(0)});
        bettingPools.placeBet(poolId, option, amount, bettor, BettingPools.TokenType.USDC, 0, sig);
        vm.stopPrank();
    }

    function calculateWinnings(uint256 betAmount, uint256 totalWinning, uint256 totalLosing)
        internal
        pure
        returns (uint256)
    {
        uint256 winAmount = (betAmount * totalLosing) / totalWinning + betAmount;
        uint256 fee = (winAmount * 90) / 10000; // PAYOUT_FEE_BP = 90
        return 1000 * 10 ** 6 - betAmount + (winAmount - fee); // Initial balance - bet amount + payout
    }

    function assertApproximatelyEqual(uint256 a, uint256 b, uint256 epsilon) internal {
        uint256 diff = a > b ? a - b : b - a;
        assertTrue(diff <= epsilon, "Values are not approximately equal");
    }
}
