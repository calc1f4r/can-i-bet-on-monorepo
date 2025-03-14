## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build --via-ir
```

### Deploy

Set all required env vars. with `source /path/to/.env`.

```shell
$ forge script script/DeployContract.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --private-keys $MAIN_PRIVATE_KEY --via-ir
```

### Verify

Set VERIFIER_URL="https://api-sepolia.basescan.org/api?" env var and ETHERSCAN_API_KEY to your Basescan API key.

First you need to get the ABI-encoded deployment args.

```shell
$ cast abi-encode "constructor(address,address)" <0xFunctionsRouterAddress> <0xUsdcAddress>
```

NOTE: You should not need to do this if using the testnet USDC token and Functions router addresses as these will not change.
Just use these pre-ABI-encoded deployment args: `0x000000000000000000000000f9b8fc078197181c841c296c876945aaa425b2780000000000000000000000003224f86e3e6dfc22ac1d04ad4037e9b1983d7ba2`

```shell
forge verify-contract <Deployed Contract Address> BettingPools --watch --verifier-url "https://api-sepolia.basescan.org/api?" --chain-id 534351 --via-ir --constructor-args <ABI Encoded Args>
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```