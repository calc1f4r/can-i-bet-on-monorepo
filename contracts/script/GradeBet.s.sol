// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";

contract GradeBetScript is Script {
    function run() external {
        // Input the poolId to send the grading request for
        uint256 poolId = 18;
        uint256 responseOption = 1; //Option A

        // Get deployer's private key from environment
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployer);

        // Attach to the BettingPools contract
        BettingPools bettingPools = BettingPools(vm.envAddress("BETTING_POOLS_ADDRESS"));

        // Grade the bet for the specified pool ID
        bettingPools.gradeBet(poolId, responseOption);

        vm.stopBroadcast();
    }
}
