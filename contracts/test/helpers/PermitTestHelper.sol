// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../../lib/forge-std/src/Test.sol";
import {ERC20Permit} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "../../src/BettingPools.sol";

/**
 * @title PermitTestHelper
 * @notice A utility library for testing contracts that use EIP-2612 permits
 * @dev Provides functions for creating permit signatures in test environments
 */
library PermitTestHelper {
    /**
     * @notice Generates a valid EIP-2612 permit signature for an ERC20 token
     * @dev Uses the Foundry VM cheatcode to sign messages with a private key
     * @param vm The Foundry VM instance
     * @param token The ERC20Permit token to generate the signature for
     * @param owner The owner of the tokens who is approving them
     * @param spender The spender being approved to transfer the tokens
     * @param amount The amount of tokens being approved
     * @param deadline The timestamp until which the signature is valid
     * @param privateKey The private key to sign with (corresponding to owner)
     * @return sig A Signature struct containing v, r, s components
     */
    function createPermitSignature(
        Vm vm,
        ERC20Permit token,
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        uint256 privateKey
    ) internal view returns (BettingPools.Signature memory sig) {
        // Get the current nonce for the owner
        uint256 nonce = token.nonces(owner);

        // Get the EIP-712 domain separator
        bytes32 domainSeparator = token.DOMAIN_SEPARATOR();

        // Construct the permit struct hash
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                spender,
                amount,
                nonce,
                deadline
            )
        );

        // Construct the typed data hash
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));

        // Sign the digest with the private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);

        // Return the signature components
        return BettingPools.Signature({v: v, r: r, s: s});
    }

    /**
     * @notice Creates a deterministic private key for a given address and returns the corresponding public address
     * @dev This is useful for generating predictable key pairs in tests
     * @param vm The Foundry VM instance
     * @param seed A seed value to generate different keys
     * @return privKey The private key
     * @return pubKey The corresponding public address
     */
    function deriveKeyPair(Vm vm, uint256 seed) internal pure returns (uint256 privKey, address pubKey) {
        privKey = uint256(keccak256(abi.encodePacked(seed)));
        // Make sure the private key is in the range [1, SECP256K1.N-1]
        privKey = (privKey % (2 ** 255 - 19 - 1)) + 1;
        pubKey = vm.addr(privKey);
        return (privKey, pubKey);
    }

    /**
     * @notice Helper function that combines signature generation and bet placement in one call
     * @dev Useful for tests to reduce boilerplate code when placing bets
     * @param vm The Foundry VM instance
     * @param bettingPools The BettingPools contract instance
     * @param token The USDC token contract (must be ERC20Permit)
     * @param bettor The address placing the bet
     * @param privateKey The private key of the bettor for signing
     * @param poolId The pool ID to bet on
     * @param option The option index to bet on (0 or 1)
     * @param amount The amount to bet
     * @return betId The ID of the created bet
     */
    function placeBetWithPermit(
        Vm vm,
        BettingPools bettingPools,
        ERC20Permit token,
        address bettor,
        uint256 privateKey,
        uint256 poolId,
        uint256 option,
        uint256 amount
    ) internal returns (uint256 betId) {
        uint256 deadline = block.timestamp + 1 hours;

        // Generate permit signature
        BettingPools.Signature memory sig =
            createPermitSignature(vm, token, bettor, address(bettingPools), amount, deadline, privateKey);

        // Place bet with permit
        vm.prank(bettor);
        betId = bettingPools.placeBet(poolId, option, amount, bettor, deadline, sig);

        return betId;
    }
}
