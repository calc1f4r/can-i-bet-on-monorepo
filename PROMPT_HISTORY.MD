# Well written prompts used in the project

## Port a function from Smart Contracts to Program

```markdown
Can you please help me port the setTwitterPostId function from @BettingPools.sol to my Solana program at @lib.rs? This is an involved update, please consider the following:

1. You must port the relevant enums, event types, and any supporting functions.
2. We will not be using the permit system in Solana, so you can drop those parameters and their logic.
3. After adding this, do `RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor build` to generate a new idl
4. Then add a new test for each function in @tests/betting-pools-2
5. Run `RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor test` to confirm your test is working
6. Now that we've finished adding the function to the Program, replace @program.json with the newly generated idl from the build located at solana/target/idl/betting_pools_2.json (you can't see this file in context because its in gitignore, so do an ls on the path to confirm location before copying)
4. Then you must update the substream protobuf at @program.proto, and add handlers in @lib.rs. Then run `substreams build` in solana/canibeton_solana.
5. Then add the new entities for the events and bet, plus the relationship from pool to bet at least, in the graphql schema at @schema.graphql (@reference-old-schema.graphql can be used as a reference for what the schema entries might look like)
6. Then run `bun run generate` in solana/canibeton_solana/subgraph
7. Then update @mappings.ts with logic to capture the new entities
8. Finally confirm your mappings.ts change worked with `bun run build` in solana/canibeton_solana/subgraph
```