import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract BetPoints is ERC20, ERC20Permit {
    uint8 private immutable _decimals;
    bytes32 public constant PERMIT_TYPEHASH = keccak256(
        "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
    );

    constructor(string memory name, string memory symbol, uint8 decimalsArg) ERC20(name, symbol) ERC20Permit(name) {
        _decimals = decimalsArg;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function DOMAIN_SEPARATOR() public view override returns (bytes32) {
        return _domainSeparatorV4();
    }

    function getHash(bytes32 structHash) public view returns (bytes32) {
        return _hashTypedDataV4(structHash);
    }
}