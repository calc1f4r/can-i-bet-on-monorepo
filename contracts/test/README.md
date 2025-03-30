# BettingPools Test Suite

This directory contains tests for the BettingPools contract, focusing on various functionality like:
- Bet voiding based on decision time
- Payout claiming
- EIP-2612 permit signature handling

## Testing Approaches

There are two main approaches used for testing the BettingPools contract:

### 1. MockBettingPools (Signature Bypass)

This approach creates a subclass of BettingPools that overrides the `placeBet` function to bypass the signature verification. This is useful when:
- You want to focus on testing core business logic without dealing with signature generation
- The test isn't specifically testing the signature verification functionality
- You need to write tests quickly without the overhead of key management

Example files:
- `BettingPoolsDecisionTime.t.sol` - Tests the voiding of bets placed after decision time
- `BettingPoolsVoidBets.t.sol` - Tests general void bet functionality

### 2. PermitTestHelper (Full Signature Generation)

This approach uses a helper library (`PermitTestHelper.sol`) to generate valid EIP-2612 permit signatures, allowing tests to interact with the unmodified BettingPools contract. This is useful when:
- You want to test the entire contract including signature verification
- You need to test specific signature-related edge cases
- You want integration tests that match production behavior exactly

Example files:
- `BettingPoolsPermitExample.t.sol` - Shows how to use the PermitTestHelper to place bets with valid signatures
- `BettingPoolsDecisionTimeWithPermits.t.sol` - Full version of the decision time tests using actual permit signatures

## Comparing the Approaches

### Mocking Approach (Using placeBetTest)
```solidity
// Transfer USDC to the contract first
vm.startPrank(bettor);
usdc.transfer(address(bettingPools), amount);
vm.stopPrank();

// Then use the test function to place the bet
vm.prank(owner);
bettingPools.placeBetTest(poolId, option, amount, bettor);
```

### Permit Approach (Using PermitTestHelper)
```solidity
// Generate permit signature
BettingPools.Signature memory sig = PermitTestHelper.createPermitSignature(
    vm,
    usdc,
    bettor,
    address(bettingPools),
    amount,
    deadline,
    privateKey
);

// Place bet with permit
vm.prank(bettor);
uint256 betId = bettingPools.placeBet(
    poolId,
    option,
    amount,
    bettor,
    deadline,
    sig
);
```

The PermitTestHelper approach is more realistic but requires slightly more code. Both approaches can be used to test the same functionality, and you can choose the one that best fits your needs for a particular test.

## Testing Utilities

### PermitTestHelper

A utility library for generating EIP-2612 permit signatures that can be used with the original `placeBet` function. It provides:

- `createPermitSignature()`: Generates a valid signature for ERC20 permit operations
- `deriveKeyPair()`: Creates a deterministic private/public key pair for testing

## Running Tests

Run all tests:
```
forge test
```

Run a specific test file:
```
forge test --match-path test/BettingPoolsDecisionTime.t.sol -vv
```

Run a specific test function:
```
forge test --match-test testVoidBetsAfterDecisionTime -vv
```

## Recommended Best Practices

For new test development:
1. Use the PermitTestHelper approach with real signatures when possible
2. Use the MockBettingPools approach for more complex scenarios where signatures would be a distraction 