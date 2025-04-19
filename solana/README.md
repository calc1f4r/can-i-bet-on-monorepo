# TEMP-solana-contracts

## Change program id

I at one point couldn't figure out how to get my initialized betting pool program state updated after adding in a new state field for is initialized, and had to run this

```bash
solana-keygen new -o target/deploy/betting_pools_2-keypair.json --force
```

This will output a new pubkey for the program to terminal, and create the key pair in the target directory that anchor checks when you run anchor keys sync.

Run anchor keys list and confirm it gave you a new program id.
Then update Anchor.toml with the new program id
Then run anchor build

## Substreams

Install sub
