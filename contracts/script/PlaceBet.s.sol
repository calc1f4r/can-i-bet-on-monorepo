// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BettingPools.sol";
import "../src/BetPoints.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/interfaces/IERC5267.sol";

contract PlaceBetScript is Script {
    function run() external {
        // Load private key from environment variables
        uint256 bettorPrivateKey = vm.envUint("ACCOUNT1_PRIVATE_KEY");
        address bettor = vm.addr(bettorPrivateKey);
        // Print the bettor's address
        console.log("Bettor address:", bettor);

        // Get contract addresses from environment variables
        address bettingPoolsAddress = vm.envAddress("BETTING_POOLS_ADDRESS");
        address tokenAddress = vm.envAddress("USDP_ADDRESS");
        // BettingPools.TokenType tokenType = BettingPools.TokenType(vm.envUint("TOKEN_TYPE")); // 0 for USDC, 1 for POINTS
        BettingPools.TokenType tokenType = BettingPools.TokenType(1); // 0 for USDC, 1 for POINTS
        BetPoints token = BetPoints(tokenAddress);
        BettingPools bettingPools = BettingPools(bettingPoolsAddress);

        // Input pool parameters
        uint256 poolId = 3;
        uint256 optionIndex = 0;
        uint256 amount = 2 * 10 ** token.decimals();

        // PERMIT SIGNATURE
        uint256 nonce = token.nonces(bettor);
        uint256 deadline = block.timestamp + 1 hours;
        bytes32 permitStructHash =
            keccak256(abi.encode(token.PERMIT_TYPEHASH(), bettor, bettingPoolsAddress, amount, nonce, deadline));
        bytes32 permitDigest = token.getHash(permitStructHash);

        // USER: signs permitDigest
        uint8 vPermit;
        bytes32 rPermit;
        bytes32 sPermit;
        (vPermit, rPermit, sPermit) = vm.sign(bettorPrivateKey, permitDigest);

        vm.startBroadcast(bettorPrivateKey);

        bettingPools.placeBet(
            poolId,
            optionIndex,
            amount,
            bettor,
            tokenType,
            deadline,
            BettingPools.Signature({v: vPermit, r: rPermit, s: sPermit})
        );

        vm.stopBroadcast();
    }
}
