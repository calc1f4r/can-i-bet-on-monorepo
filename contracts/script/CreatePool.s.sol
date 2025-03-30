// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";

contract CreatePoolScript is Script {
    function run() external {
        vm.warp(block.timestamp);

        uint256 deployerKey = vm.envUint("MAIN_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployer);

        // Attach to the BettingPools contract
        BettingPools bettingPools = BettingPools(vm.envAddress("BETTING_POOLS_ADDRESS"));

        // Pool 1: Updated to be about Claude's capabilities
        uint40 pool1BetsCloseAt = uint40(block.timestamp + 60 * 2);
        uint256 pool1Id = bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "This is just a test question",
                options: ["Option 1", "Option 2"],
                betsCloseAt: pool1BetsCloseAt,
                imageUrl: "https://res.cloudinary.com/apideck/image/upload/w_196,f_auto/v1689100675/icons/anthropic-claude.png",
                category: "AI",
                creatorName: "@crypto_oracle_42",
                creatorId: "1234",
                closureCriteria: "The criteria for when to grade the bet is when the next Claude release is announced after February 23rd 2025",
                closureInstructions: "If Claude's next release announcement highlights code generation improvements over mathematical reasoning improvements, then the first option wins. Otherwise, the second option wins."
            })
        );

        bettingPools.setTwitterPostId(pool1Id, "1894217309029634136");

        console.log("Pool created with ID:", pool1Id);

        vm.stopBroadcast();
    }
}
