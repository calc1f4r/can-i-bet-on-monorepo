// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../lib/forge-std/src/Test.sol";
import "../src/BettingPools.sol";
import "../src/USDP.sol";
import "./helpers/PermitTestHelper.sol";

/**
 * @title BettingPoolsPermitExample
 * @notice Example test showing how to use the PermitTestHelper to place bets with EIP-2612 permits
 * @dev This demonstrates an alternative to the MockBettingPools approach, allowing tests to
 * work with the original contract without bypassing signature verification
 */
contract BettingPoolsPermitExampleTest is Test {
    BettingPools public bettingPools;
    USDP public usdc;

    address public owner;
    address public bettor;
    uint256 private bettorPrivateKey;

    uint256 public poolId;
    uint40 public betsCloseAt;

    function setUp() public {
        // Generate a deterministic key pair for the bettor
        (bettorPrivateKey, bettor) = PermitTestHelper.deriveKeyPair(vm, 1);

        // Use a separate address for the owner
        owner = address(0x1);

        // Setup contracts
        vm.startPrank(owner);
        usdc = new USDP("USD Proxy", "USDP", 6);
        bettingPools = new BettingPools(address(usdc));
        vm.stopPrank();

        // Mint USDC to bettor
        uint256 initialBalance = 1000 * 10 ** 6; // 1000 USDC
        vm.startPrank(owner);
        usdc.mint(bettor, initialBalance);
        vm.stopPrank();

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

    function testPlaceBetWithPermit() public {
        // Define bet parameters
        uint256 optionIndex = 0; // "Yes" option
        uint256 amount = 100 * 10 ** 6; // 100 USDC
        uint256 deadline = block.timestamp + 1 hours;

        // Generate the permit signature
        BettingPools.Signature memory sig = PermitTestHelper.createPermitSignature(
            vm, usdc, bettor, address(bettingPools), amount, deadline, bettorPrivateKey
        );

        // Place the bet using the original placeBet function with the permit
        vm.prank(bettor);
        uint256 betId = bettingPools.placeBet(poolId, optionIndex, amount, bettor, deadline, sig);

        // Verify that the bet was created successfully
        assertTrue(betId > 0, "Bet ID should be non-zero");

        // Verify the bet details
        (
            uint256 id,
            address owner,
            uint256 option,
            uint256 betAmount,
            uint256 betPoolId,
            ,
            , // createdAt, updatedAt
            bool isPayedOut,
            BettingPools.BetOutcome payoutResolution
        ) = bettingPools.bets(betId);

        assertEq(id, betId, "Bet ID should match");
        assertEq(owner, bettor, "Bet owner should be the bettor");
        assertEq(option, optionIndex, "Option should match");
        assertEq(betAmount, amount, "Bet amount should match");
        assertEq(betPoolId, poolId, "Pool ID should match");
        assertFalse(isPayedOut, "Bet should not be paid out initially");
        assertEq(uint256(payoutResolution), uint256(BettingPools.BetOutcome.NONE), "Payout resolution should be NONE");

        // Check that USDC was transferred from the bettor to the contract
        assertEq(usdc.balanceOf(bettor), 900 * 10 ** 6, "Bettor should have 900 USDC left");
        assertEq(usdc.balanceOf(address(bettingPools)), 100 * 10 ** 6, "Contract should have 100 USDC");
    }
}
