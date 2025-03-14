// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";
import "../src/USDP.sol";
// Script to deploy and seed the application contract with data
// Deploy application contract, launch 5 pools, place bets on them across 3 accounts

// Pick one of the following variations
//   DEPLOY_USDP=true forge script contracts/script/DeployContract.s.sol
//   DEPLOY_USDP=false USDP_ADDRESS=0x1234567890123456789012345678901234567890 forge script contracts/script/DeployContract.s.sol
contract DemoPoolsScript is Script {
    function run() external {
        // Warp to current block timestamp
        vm.warp(block.timestamp);

        // Deploy USDP token first
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Check if we should deploy USDP or use existing address
        bool shouldDeployUsdp = vm.envOr("DEPLOY_USDP", false);
        address mockUsdcAddress;

        vm.startBroadcast(deployer);

        if (shouldDeployUsdp) {
            // Deploy USDP with 6 decimals like USDC
            USDP usdp = new USDP("USD Points", "USDP", 6);
            mockUsdcAddress = address(usdp);
            console.log("Deployed USDP at address:", mockUsdcAddress);
        } else {
            // Use existing USDP address from environment
            mockUsdcAddress = vm.envAddress("USDP_ADDRESS");
            console.log("Using existing USDP at address:", mockUsdcAddress);
        }

        // Deploy BettingPools with the USDP address
        BettingPools bettingPools = new BettingPools(mockUsdcAddress);
        console.log("Deployed BettingPools at address:", address(bettingPools));

        vm.stopBroadcast();
    }
}
