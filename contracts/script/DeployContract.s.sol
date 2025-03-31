// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";
import "../src/BetPoints.sol";


// Script to deploy and seed the application contract with data
// Deploy application contract, launch 5 pools, place bets on them across 3 accounts
contract DemoPoolsScript is Script {
    function run() external {
        // Warp to current block timestamp
        vm.warp(block.timestamp);

        // Deploy BetPoints token first
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Check if we should deploy BetPoints or use existing address
        bool shouldDeployUsdp = vm.envOr("DEPLOY_BET_POINTS", false);
        address betPointsAddress;
        address usdcAddress = vm.envAddress("USDC_ADDRESS");

        vm.startBroadcast(deployer);

        if (shouldDeployUsdp) {
            // Deploy BetPoints with 6 decimals like USDC
            BetPoints bp = new BetPoints("Bet Points", "BET", 6);
            betPointsAddress = address(bp);
            console.log("Deployed BetPoints at address:", betPointsAddress);
        } else {
            // Use existing BetPoints address from environment
            betPointsAddress = vm.envAddress("BET_POINTS_ADDRESS");
            console.log("Using existing BetPoints at address:", betPointsAddress);
        }

        // Deploy BettingPools with both USDC and BetPoints addresses
        BettingPools bettingPools = new BettingPools(usdcAddress, betPointsAddress);
        console.log("Deployed BettingPools at address:", address(bettingPools));

        vm.stopBroadcast();
    }
}
