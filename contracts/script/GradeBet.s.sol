// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";

contract GradeBetScript is Script {
    function run() external {
        // Input the poolId to send the grading request for
        uint256 poolId = 3;
        uint256 responseOption = 0; //Option A
        uint40 decisionTime = uint40(block.timestamp - 1 hours); // Setting decision time to 1 hour ago

        // Get deployer's private key from environment
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployer);

        // Attach to the BettingPools contract
        BettingPools bettingPools = BettingPools(vm.envAddress("BETTING_POOLS_ADDRESS"));

        // Grade the bet for the specified pool ID
        bettingPools.gradeBet(poolId, responseOption, decisionTime);

        vm.stopBroadcast();
    }
}
