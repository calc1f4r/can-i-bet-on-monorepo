// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";

contract SetFunctionsRequestParams is Script {
    function run() external {
        // Get deployer's private key from environment
        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployer);

        // Attach to the BettingPools contract
        BettingPools bettingPools = BettingPools(vm.envAddress("BETTING_POOLS_ADDRESS"));

        // Set the Functions request configuration parameters
        bettingPools.setFunctionsRequestConfig(
            144,
            bytes32(0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000),
            300000
        );

        // Set the encrypted secrets reference
        bettingPools.setFunctionsSecrets(
            hex"76d52521d2f52b96a6ad8e05218195820395c7efebd73701dd852304e12f8869a6e941b12bc6206d08e9bf275667ab87821b00aa9902d66cd48d13ea2ce901dcc950bf2083cba201c96b601b943d01818d5250c44869ef9da0daa1dd7db34e43f0c73ae602c73da0755afb4a45b23c380e2395ced126a39fb972c4f030e67ecdc702513562882689246ee76a7e7108b6333d56072d7d1fddbe815d15c736b6b4c6"
        );

        vm.stopBroadcast();
    }
}
