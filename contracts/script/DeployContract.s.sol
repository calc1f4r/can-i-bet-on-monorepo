// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";

// Script to deploy and seed the application contract with data
// Deploy application contract, launch 5 pools, place bets on them across 3 accounts
contract DemoPoolsScript is Script {
    function run() external {
        // Warp to current block timestamp
        vm.warp(block.timestamp);

        // Load private keys from environment variables
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Get the mock USDC address
        address mockUsdcAddress = vm.envAddress("MOCK_USDC_ADDRESS");

        vm.startBroadcast(deployer);

        new BettingPools(mockUsdcAddress);

        vm.stopBroadcast();
    }
}
