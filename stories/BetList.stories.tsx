import { GET_BETS } from "@/app/queries";
import type { GetBetsQuery } from "@/lib/__generated__/graphql";
import { PoolStatus } from "@/lib/__generated__/graphql";
import { MockedProvider } from "@apollo/client/testing";
import type { Meta, StoryObj } from "@storybook/react";
import { BetList } from "./BetList";

// Create mock bets that match the GetBetsQuery["bets"] type
const mockBets: GetBetsQuery["bets"] = [
  {
    id: "0x01",
    betIntId: "1",
    blockTimestamp: "1710000000", // Recent timestamp
    amount: "1000000", // 1 USDC
    optionIndex: "0",
    transactionHash:
      "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
    userAddress: "0xabc123def456abc123def456abc123def456abc1",
    poolIntId: "1",
    blockNumber: "1000000",
    pool: {
      id: "0x01",
      poolIntId: "1",
      question: "Will BTC reach 100k in 2024?",
      options: ["YES", "NO"],
      status: PoolStatus.Pending,
      selectedOption: "-1",
      totalBets: "150000000", // 150 USDC
      totalBetsByOption: ["90000000", "60000000"], // 90 USDC on YES, 60 USDC on NO
      decisionDate: "1735689600", // Dec 31, 2024
      betsCloseAt: "1735603200", // Dec 30, 2024
      creatorId: "0xdef456abc789def456abc789def456abc789def4",
      creatorName: "Crypto Predictor",
      imageUrl: "https://example.com/btc.png",
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: "1234567890",
    },
  },
  {
    id: "0x02",
    betIntId: "2",
    blockTimestamp: "1709900000",
    amount: "5000000", // 5 USDC
    optionIndex: "1",
    transactionHash:
      "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd",
    userAddress: "0xdef456abc789def456abc789def456abc789def4",
    poolIntId: "2",
    blockNumber: "1000001",
    pool: {
      id: "0x02",
      poolIntId: "2",
      question: "Will ETH reach 10k in 2024?",
      options: ["YES", "NO"],
      status: PoolStatus.Pending,
      selectedOption: "-1",
      totalBets: "250000000",
      totalBetsByOption: ["100000000", "150000000"],
      decisionDate: "1735689600", // Dec 31, 2024
      betsCloseAt: "1735603200", // Dec 30, 2024
      creatorId: "0x789abc123def456789abc123def456789abc1234",
      creatorName: "ETH Enthusiast",
      imageUrl: "https://example.com/eth.png",
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: "0987654321",
    },
  },
  {
    id: "0x03",
    betIntId: "3",
    blockTimestamp: "1709800000",
    amount: "10000000", // 10 USDC
    optionIndex: "0",
    transactionHash:
      "0x789abcdef123456789abcdef123456789abcdef123456789abcdef123456789a",
    userAddress: "0x789abc123def456789abc123def456789abc1234",
    poolIntId: "3",
    blockNumber: "1000002",
    pool: {
      id: "0x03",
      poolIntId: "3",
      question: "Will Ethereum switch to proof of stake in 2024?",
      options: ["YES", "NO"],
      status: PoolStatus.Graded,
      selectedOption: "0", // YES was correct
      totalBets: "500000000",
      totalBetsByOption: ["300000000", "200000000"],
      decisionDate: "1735689600", // Dec 31, 2024
      betsCloseAt: "1735603200", // Dec 30, 2024
      creatorId: "0xabc123def456abc123def456abc123def456abc1",
      creatorName: "ETH Developer",
      imageUrl: "https://example.com/eth-pos.png",
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: "1357924680",
    },
  },
  // Additional bets for more variety
  {
    id: "0x05",
    betIntId: "5",
    blockTimestamp: "1709600000",
    amount: "15000000", // 15 USDC
    optionIndex: "0",
    transactionHash:
      "0x567890abcdef123456789abcdef123456789abcdef123456789abcdef123456",
    userAddress: "0x567890abcdef123456789abcdef123456789abcd",
    poolIntId: "2",
    blockNumber: "1000003",
    pool: {
      id: "0x02",
      poolIntId: "2",
      question: "Will Ethereum switch to proof of stake in 2024?",
      options: ["YES", "NO"],
      status: PoolStatus.Graded,
      selectedOption: "0",
      totalBets: "500000000",
      totalBetsByOption: ["300000000", "200000000"],
      decisionDate: "1735689600", // Dec 31, 2024
      betsCloseAt: "1735603200", // Dec 30, 2024
      creatorId: "0x789abc123def456789abc123def456789abc1234",
      creatorName: "ETH Enthusiast",
      imageUrl: "https://example.com/eth-pos.png",
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: "0987654321",
    },
  },
  {
    id: "0x06",
    betIntId: "6",
    blockTimestamp: "1709500000",
    amount: "20000000", // 20 USDC
    optionIndex: "1",
    transactionHash:
      "0x890abcdef123456789abcdef123456789abcdef123456789abcdef12345678",
    userAddress: "0xabc123def456abc123def456abc123def456abc1",
    poolIntId: "1",
    blockNumber: "1000004",
    pool: {
      id: "0x01",
      poolIntId: "1",
      question: "Will BTC reach 100k in 2024?",
      options: ["YES", "NO"],
      status: PoolStatus.Graded,
      selectedOption: "-1",
      totalBets: "150000000",
      totalBetsByOption: ["90000000", "60000000"],
      decisionDate: "1735689600", // Dec 31, 2024
      betsCloseAt: "1735603200", // Dec 30, 2024
      creatorId: "0xdef456abc789def456abc789def456abc789def4",
      creatorName: "Crypto Predictor",
      imageUrl: "https://example.com/btc.png",
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: "1234567890",
    },
  },
];

const mocks = [
  // Home view - all bets for pool 0x01
  {
    request: {
      query: GET_BETS,
      variables: {
        filter: { poolId: "0x01" },
        orderBy: "blockTimestamp",
        orderDirection: "desc",
      },
    },
    result: {
      data: {
        bets: mockBets.filter((bet) => bet.pool.id === "0x01"),
      },
    },
  },
  // Pool drilldown view - all bets for pool 0x02
  {
    request: {
      query: GET_BETS,
      variables: {
        filter: { poolId: "0x02" },
        orderBy: "blockTimestamp",
        orderDirection: "desc",
      },
    },
    result: {
      data: {
        bets: mockBets.filter((bet) => bet.pool.id === "0x02"),
      },
    },
  },
  // User specific view - all bets for specific user
  {
    request: {
      query: GET_BETS,
      variables: {
        filter: { user: "0xabc123def456abc123def456abc123def456abc1" },
        orderBy: "blockTimestamp",
        orderDirection: "desc",
      },
    },
    result: {
      data: {
        bets: mockBets.filter(
          (bet) => bet.userAddress === "0xabc123def456abc123def456abc123def456abc1"
        ),
      },
    },
  },
  // Empty pool
  {
    request: {
      query: GET_BETS,
      variables: {
        filter: { poolId: "0x0192992118917891789274918741982749" },
        orderBy: "blockTimestamp",
        orderDirection: "desc",
      },
    },
    result: {
      data: {
        bets: [],
      },
    },
  },
];

const meta: Meta<typeof BetList> = {
  title: "Components/BetList",
  component: BetList,
  decorators: [
    (Story) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <Story />
      </MockedProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["home", "poolDrilldown"],
      defaultValue: "home",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BetList>;

export const Home: Story = {
  args: {
    poolId: "0x01",
    variant: "home",
  },
};

export const PoolDrilldown: Story = {
  args: {
    poolId: "0x02", // Pool with a resolved bet
    variant: "poolDrilldown",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    poolId: "0x0192992118917891789274918741982749",
  },
};

export const UserBets: Story = {
  args: {
    userId: "0xabc123def456abc123def456abc123def456abc1", // User with multiple bets
  },
};
