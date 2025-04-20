#!/bin/bash

set -e

# 1. Get old program id from lib.rs
LIB_RS_PATH="./programs/betting-pools-2/src/lib.rs"
OLD_PROGRAM_ID=$(grep -o 'declare_id!("[^"]*")' $LIB_RS_PATH | grep -o '"[^"]*"' | tr -d '"')
echo "Old Program ID: $OLD_PROGRAM_ID"

# 2. Generate new keypair
echo "Generating new keypair..."
solana-keygen new -o target/deploy/betting_pools_2-keypair.json --force --no-passphrase

# 3. Run anchor keys sync
echo "Syncing keys with Anchor..."
anchor keys sync

# 4. Get new program id from lib.rs after anchor keys sync
NEW_PROGRAM_ID=$(grep -o 'declare_id!("[^"]*")' $LIB_RS_PATH | grep -o '"[^"]*"' | tr -d '"')
echo "New Program ID: $NEW_PROGRAM_ID"

# 5. Replace old id in specified files
echo "Replacing program ID in files..."

# Update Anchor.toml
sed -i '' "s/$OLD_PROGRAM_ID/$NEW_PROGRAM_ID/g" Anchor.toml
echo "Updated Anchor.toml"

# Update substreams library
sed -i '' "s/$OLD_PROGRAM_ID/$NEW_PROGRAM_ID/g" canibeton_solana/src/lib.rs
echo "Updated canibeton_solana/src/lib.rs"

# Update IDL
sed -i '' "s/$OLD_PROGRAM_ID/$NEW_PROGRAM_ID/g" canibeton_solana/idls/program.json
echo "Updated canibeton_solana/idls/program.json"

echo "Program ID rotation complete! New ID: $NEW_PROGRAM_ID"

# Build project with specified Rust nightly toolchain
echo "Building project with nightly-2025-04-14 toolchain..."
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor build

# Copy the IDL to the substreams directory
echo "Copying IDL file to canibeton_solana/idls/program.json..."
mkdir -p "./canibeton_solana/idls"
cp "./target/idl/betting_pools_2.json" "./canibeton_solana/idls/program.json"
echo "IDL file updated"

echo "Program ID rotation complete!"
echo "Old Program ID: $OLD_PROGRAM_ID"
echo "New Program ID: $NEW_PROGRAM_ID"
