Mermaid graph:

```mermaid
graph TD;
  map_program_data[map: map_program_data];
  solana:blocks_without_votes --> map_program_data;
  solana:blocks_without_votes[map: solana:blocks_without_votes];
  sf.solana.type.v1.Block[source: sf.solana.type.v1.Block] --> solana:blocks_without_votes;
  solana:v020:blocks_without_votes --> solana:program_ids_without_votes;
  solana:v020:blocks_without_votes[map: solana:v020:blocks_without_votes];
  sf.solana.type.v1.Block[source: sf.solana.type.v1.Block] --> solana:v020:blocks_without_votes;

```

Here is a quick link to see the graph:

https://mermaid.live/edit#pako:eJyskMFqwzAMhl8l6JyGbLu5t9E32G51CZqtNmaxZWw5o5S---jSsY2SFkav8if__6cDGLYECnYJY1-9rpY6VJXH2MXEu4S-syi49hjVxXTzxWYeMKB6G9i85-7DSc9FupGFcrVY6NK2T3SxemtzCrwCnLO3zcQ0so_UjA_N84ldZy7JkJp73_wUuxLxu-PYPrY3FM_kt6Wz__nuj_csdWf52ZylDlCDp-TRWVBw0CA9edKgNFjaYhlEwxFqwCL8sg8GlKRCNZRoUWjl8HSLaXj8DAAA__9dt-Jz
