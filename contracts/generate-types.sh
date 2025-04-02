#!/bin/bash

# Check if wagmi CLI is installed globally
if ! command -v wagmi &>/dev/null; then
    echo "wagmi CLI not found, installing..."
    bun install --global @wagmi/cli
fi

# Build contracts first
echo "Building contracts..."
forge build

# Create types directory if it doesn't exist
mkdir -p types

# Generate types using wagmi CLI
echo "Generating types..."
wagmi generate


# Copy generated types to frontend, backend, and common
echo "Copying types to frontend, backend, and common directory..."
mv types/generated.ts ../lib/contract.types.ts
rm -rf types

echo "✨ Types generated and copied successfully!"
