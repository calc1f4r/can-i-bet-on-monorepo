import {
  Bet,
  BetOutcome,
  PoolStatus,
  TokenType,
} from "@/lib/__generated__/graphql";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityLine } from "./ActivityLine";

const meta: Meta<typeof ActivityLine> = {
  title: "Components/ActivityLine",
  component: ActivityLine,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActivityLine>;

// Create a mock bet object that matches the Bet type
const createMockBet = (optionIndex: number, options: string[]): Bet => ({
  id: "0x1234",
  betIntId: "1",
  optionIndex: optionIndex.toString(),
  amount: "10000000", // $10 with 6 decimals (USDC)
  user: {
    __typename: "User",
    id: "0x1234567890123456789012345678901234567890",
    address: "0x1234567890123456789012345678901234567890",
    bets: [],
    lastLogin: undefined,
    loginStreak: undefined,
    lossStreak: undefined,
    totalLossAmount: undefined,
    totalLossCount: undefined,
    totalWinAmount: undefined,
    totalWinCount: undefined,
    winStreak: undefined,
  },
  userAddress: "0x1234567890123456789012345678901234567890",
  poolIntId: "1",
  blockNumber: "123456",
  blockTimestamp: ((Date.now() - 5 * 60 * 1000) / 1000).toString(), // 5 minutes ago
  transactionHash: "0xabcdef",
  chainId: "1",
  chainName: "Ethereum",
  createdAt: "0",
  updatedAt: "0",
  poolIdHex: "0x0",
  payoutClaimed: false,
  outcome: BetOutcome.None,
  tokenType: TokenType.Usdc,
  pool: {
    __typename: "Pool",
    id: "0x5678",
    poolIntId: "1",
    question: "Will Bitcoin reach $100k by 2024?",
    options,
    usdcBetTotalsByOption: ["5", "5"],
    pointsBetTotalsByOption: ["0", "0"],
    usdcVolume: "10",
    pointsVolume: "0",
    selectedOption: "-1",
    status: PoolStatus.Pending,
    decisionTime: "1735689600", // Some date in 2025
    betsCloseAt: "1735603200", // Some date in 2025
    creatorId: "0x9876",
    creatorName: "Crypto Predictor",
    imageUrl: "https://picsum.photos/200",
    chainId: "1",
    chainName: "Ethereum",
    isDraw: false,
    xPostId: "123456789",
    // Adding missing properties to satisfy the Pool type
    bets: [],
    category: "Crypto",
    closureCriteria: "Price on CoinGecko",
    closureInstructions: "Check the price on CoinGecko on the decision date",
    createdBlockNumber: "100000",
    createdBlockTimestamp: "1625097600",
    createdTransactionHash: "0xabc123",
    gradedBlockNumber: "0",
    gradedBlockTimestamp: "0",
    gradedTransactionHash: "0x0",
    lastUpdatedBlockNumber: "100000",
    lastUpdatedBlockTimestamp: "1625097600",
    lastUpdatedTransactionHash: "0xabc123",
  },
});

// Create a story with a larger bet amount
const createLargeBetMock = (optionIndex: number, options: string[]): Bet => {
  const bet = createMockBet(optionIndex, options);
  return {
    ...bet,
    amount: "25000000000", // $25,000 with 6 decimals (USDC)
  };
};

export const BetOnYes: Story = {
  args: {
    bet: createMockBet(0, ["YES", "NO"]),
    showQuestion: true,
  },
};

export const BetOnNo: Story = {
  args: {
    bet: createMockBet(1, ["YES", "NO"]),
    showQuestion: true,
  },
};

export const BetOnOptionA: Story = {
  args: {
    bet: createMockBet(0, ["Option A", "Option B", "Option C"]),
    showQuestion: true,
  },
};

export const BetOnOptionB: Story = {
  args: {
    bet: createMockBet(1, ["Option A", "Option B", "Option C"]),
    showQuestion: true,
  },
};

export const BetOnOptionC: Story = {
  args: {
    bet: createMockBet(2, ["Option A", "Option B", "Option C"]),
    showQuestion: true,
  },
};

export const HideQuestion: Story = {
  args: {
    bet: createMockBet(0, ["YES", "NO"]),
    showQuestion: false,
  },
};

export const LargeBetAmount: Story = {
  args: {
    bet: createLargeBetMock(0, ["YES", "NO"]),
    showQuestion: true,
  },
};
