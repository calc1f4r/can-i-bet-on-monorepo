# PromptBet Monorepo

This monorepo contains three packages:

- `frontend`: Next.js web application
- `contracts`: Solidity smart contracts
- `graph`: Graph Protocol indexing

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Package manager)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contracts)

### Installation

```bash
# Install dependencies for all packages
bun install

# Build all packages (contracts are built first)
bun run build
```

## Project Structure

This monorepo uses the following structure:

```
.
├── contracts/       # Smart contracts with Foundry
├── frontend/        # Next.js web application
└── graph/           # The Graph indexing service
```

### Importing Contract Artifacts

The frontend imports contract artifacts from the contracts package. This is configured via:

1. Path aliases in `frontend/tsconfig.json`
2. Webpack aliases in `frontend/next.config.ts` 

When building, contracts are built first to ensure artifacts are available.

## Package-specific commands

### Frontend

```bash
# Start development server
bun frontend dev

# Build
bun frontend build

# Run storybook
bun frontend storybook
```

### Contracts

```bash
# Build contracts
bun contracts build

# Run tests
bun contracts test

# Generate types
bun contracts generate-types
```

### Graph

```bash
# Build graph
bun graph build

# Generate code
bun graph codegen
```