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
        uint40 pool1BetsCloseAt = uint40(block.timestamp + 60 * 60 * 2);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "What will be Claude's primary improvement in its next release?",
                options: ["Code Generation", "Mathematical Reasoning"],
                betsCloseAt: pool1BetsCloseAt,
                imageUrl: "https://res.cloudinary.com/apideck/image/upload/w_196,f_auto/v1689100675/icons/anthropic-claude.png",
                category: "AI",
                creatorName: "@crypto_oracle_42",
                creatorId: "1234",
                closureCriteria: "The criteria for when to grade the bet is when the next Claude release is announced after February 23rd 2025",
                closureInstructions: "If Claude's next release announcement highlights code generation improvements over mathematical reasoning improvements, then the first option wins. Otherwise, the second option wins."
            })
        );

        bettingPools.setTwitterPostId(1, "1894217309029634136");

        // Pool 2: Bitcoin ETF Impact
        uint40 pool2BetsCloseAt = uint40(block.timestamp + 60 * 60 * 2);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "Will Bitcoin's price be higher 24 hours after Blackrock's ETF first daily trading volume is reported?",
                options: ["Yes", "No"],
                betsCloseAt: pool2BetsCloseAt,
                imageUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/1.png",
                category: "Crypto",
                creatorName: "@btc_analyst",
                creatorId: "5678",
                closureCriteria: "The bet will be graded 24 hours after Blackrock's Bitcoin ETF reports its first complete trading day volume",
                closureInstructions: "Compare BTC price at the moment of first trading day volume report vs exactly 24 hours later. Use Coinbase price as reference. If price is higher, first option wins. If lower or equal, second option wins."
            })
        );

        bettingPools.setTwitterPostId(2, "1894217309029634136");

        // Pool 3: Apple Vision Pro Sales
        uint40 pool3BetsCloseAt = uint40(block.timestamp + 60 * 60 * 4);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "Will Apple Vision Pro sell over 500,000 units in its first month?",
                options: ["Over 500k", "Under 500k"],
                betsCloseAt: pool3BetsCloseAt,
                imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/vision-pro-side?wid=96&hei=96&fmt=png-alpha",
                category: "Technology",
                creatorName: "@tech_insider",
                creatorId: "9012",
                closureCriteria: "The bet will be graded when Apple or a reputable market research firm (IDC, Canalys, etc.) releases first month sales figures",
                closureInstructions: "If official or reputable third-party data shows sales exceeded 500,000 units in the first 30 days of release, first option wins. Otherwise, second option wins."
            })
        );

        bettingPools.setTwitterPostId(3, "1894217309029634136");

        // Pool 4: Super Bowl LVIII
        uint40 pool4BetsCloseAt = uint40(block.timestamp + 60 * 60 * 4);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "Which team will score first in Super Bowl LVIII?",
                options: ["San Francisco 49ers", "Kansas City Chiefs"],
                betsCloseAt: pool4BetsCloseAt,
                imageUrl: "https://static.www.nfl.com/image/private/t_q-best/league/mywogy71oluagu0qmgaz",
                category: "Sports",
                creatorName: "@sports_expert",
                creatorId: "3456",
                closureCriteria: "The bet will be graded immediately after the first score of Super Bowl LVIII",
                closureInstructions: "First team to put points on the scoreboard (any type of score) wins. If game is cancelled, bets will be refunded."
            })
        );

        bettingPools.setTwitterPostId(4, "1894217309029634136");

        // Pool 5: Tesla Cybertruck Production
        uint40 pool5BetsCloseAt = uint40(block.timestamp + 60 * 60 * 6);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "How many Cybertrucks will Tesla deliver in Q1 2024?",
                options: ["Over 10,000", "Under 10,000"],
                betsCloseAt: pool5BetsCloseAt,
                imageUrl: "https://tesla-cdn.thron.com/delivery/public/image/tesla/8c26f779-11e5-4cfc-bd7c-dcd03b18ff88/bvlatuR/std/4096x2560/Cybertruck-Exterior-Front-Trunk-Desktop",
                category: "Automotive",
                creatorName: "@ev_tracker",
                creatorId: "7890",
                closureCriteria: "The bet will be graded when Tesla releases their Q1 2024 delivery numbers",
                closureInstructions: "Based on official Tesla Q1 2024 delivery report. If Cybertruck deliveries exceed 10,000 units, first option wins. If 10,000 or fewer, second option wins."
            })
        );

        bettingPools.setTwitterPostId(5, "1894217309029634136");

        // Pool 6: OpenAI's Next CEO
        uint40 pool6BetsCloseAt = uint40(block.timestamp + 60 * 60 * 6);
        bettingPools.createPool(
            BettingPools.CreatePoolParams({
                question: "Will Sam Altman return as permanent CEO of OpenAI by end of Q2 2024?",
                options: ["Yes", "No"],
                betsCloseAt: pool6BetsCloseAt,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/OpenAI_logo.svg",
                category: "AI",
                creatorName: "@ai_insider",
                creatorId: "2468",
                closureCriteria: "The bet will be graded based on OpenAI's official announcement of permanent CEO appointment by June 30th, 2024",
                closureInstructions: "If Sam Altman is officially appointed as permanent CEO (not interim) by June 30th 2024, first option wins. If someone else is appointed or no permanent CEO is named by then, second option wins."
            })
        );

        bettingPools.setTwitterPostId(6, "1894217309029634136");

        vm.stopBroadcast();
    }
}
