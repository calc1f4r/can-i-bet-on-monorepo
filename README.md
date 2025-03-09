# Can I Bet On? monorepo

![Can I Bet On? Hero](./stories/assets/canibeton-hero.png)

## Contents

- [app](./app), [components](./components), [lib](./lib), [stories](./stories) - source code for the frontend
- [app/api](./app/api) - source code for a small backend for gasless transactions
- [contracts](./contracts) - source code and scripts for the contracts
- [custom indexer](./graph) - Custom indexer setup to track pools and bets for the app

We have a separate repo for the agent code, which can be found on GitHub here in [can-i-bet-on-ethdenver2025/can-i-bet-on-agent](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-agent). There you will find our X and Telegram agents that create betting pools, and our custom oracle agent that grades the pools

## Production

The production app is hosted on Vercel at: <https://can-i-bet-on.vercel.app>

You can create a new betting pool on demand by [mentioning our agent, @CanIBetOn, on X here](https://x.com/CanIBetOn), or by [privately DMing our agent on Telegram here](https://t.me/HalluciBetrBot).

Our testnet contracts are deployed on Base Sepolia here:
Main app contract:

- [0xcA7214565ae6994F81e5dd1ed97a4F817afa0A25](https://sepolia.basescan.org/address/0xcA7214565ae6994F81e5dd1ed97a4F817afa0A25)
- USDP - USD Points contract (Sepolia only). This is our ERC-20 token that lets users place bets on the app w/o financial risk, similar to Fliff Points in its current incarnation: [0x3224f86e3e6dfC22aC1d04Ad4037e9b1983D7ba2](https://sepolia.basescan.org/address/0x3224f86e3e6dfC22aC1d04Ad4037e9b1983D7ba2)

Our mainnet contract is deployed on Base here:

- Main app contract: [0x6853357edeEd20Af6136510Fb2E5A53aBdb91e16](https://basescan.org/address/0x6853357edeEd20Af6136510Fb2E5A53aBdb91e16)
- (We do not have USDP on mainnet, we use USDC for all transactions instead)

## Sponsors/Key tech

- [Coinbase/Base](https://www.coinbase.com) - Our app has been [powered by Base Sepolia testnet](https://sepolia.basescan.org/address/0xcA7214565ae6994F81e5dd1ed97a4F817afa0A25) for the duration of the hackathon, and [we started a mainnet deployment too](https://basescan.org/address/0xa34459de4cf47821f3284a9cd41e22f32b708da3). Our subgraph is also indexing Base Sepolia.Base is a natural pick for this project since it supports solidity and has extremely low gas fees.
- [Chainlink](https://chain.link) - We use Chainlink Functions the [manage grading betting pools in a decentralized way](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-monorepo/blob/main/contracts/src/BettingPools.sol#L271)
- [The Graph](https://thegraph.com) - We use The Graph to [index our bets and pools](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-monorepo/tree/main/graph) to display stats + use it for real time updating in the frontend w/ subgraph subscriptions. Our production app runs against [Subgraph Studio here](https://api.studio.thegraph.com/query/105510/promptbet/version/latest)
- [Privy](https://www.privy.io) - We use Privy's embedded wallet universally across the app and intend to use its funding onramp later to avoid having to go through so many menus to place bets w/ traditional web3 wallets. You can see the privy integration [in our automatic faucet/top up here](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-monorepo/blob/main/components/PrivyLoginButton.tsx#L54), how we use it to [sign in and sign up here](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-monorepo/blob/main/components/PrivyLoginButton.tsx#L10)
- [Alchemy](https://www.alchemy.com) - [Alchemy is our private RPC provider](https://github.com/can-i-bet-on-ethdenver2025/can-i-bet-on-monorepo/blob/main/app/api/signing/getSigningProps/route.ts#L15). Private RPCs were critical for managing gasless transactions, we built our backend around Alchemy
