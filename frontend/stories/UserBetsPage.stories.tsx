import { GET_BETS } from "@/app/queries";
import {
  Bet_OrderBy,
  OrderDirection,
  PoolStatus,
} from "@/lib/__generated__/graphql";
import { CHAIN_CONFIG } from "@/lib/config";
import { MockedProvider } from "@apollo/client/testing";
import type { Meta, StoryObj } from "@storybook/react";
import { UserBetsPage } from "./UserBetsPage";

// Create mock data for the GraphQL query
const mockBets = [
  {
    id: "0x123",
    betIntId: "1",
    optionIndex: "0",
    amount: "1000000",
    user: "0x1234567890abcdef1234567890abcdef12345678",
    poolIntId: "1",
    blockNumber: "123456",
    blockTimestamp: (Date.now() / 1000 - 3600).toString(), // 1 hour ago
    transactionHash: "0xabcdef",
    pool: {
      id: "0x456",
      poolIntId: "1",
      question: "Will Bitcoin reach $100k by the end of 2024?",
      options: ["Yes", "No"],
      totalBets: "5000000",
      totalBetsByOption: ["3000000", "2000000"],
      selectedOption: null,
      status: PoolStatus.Pending,
      decisionDate: (Date.now() / 1000 + 86400 * 30).toString(), // 30 days from now
      betsCloseAt: (Date.now() / 1000 + 86400 * 15).toString(), // 15 days from now
      creatorId: "123",
      creatorName: "crypto_predictor",
      imageUrl: "https://picsum.photos/200",
      chainId: "534351",
      chainName: "Scroll Sepolia",
      isDraw: false,
      xPostId: "123456",
      __typename: "Pool",
    },
    __typename: "Bet",
  },
  {
    id: "0x789",
    betIntId: "2",
    optionIndex: "1",
    amount: "2000000",
    user: "0x1234567890abcdef1234567890abcdef12345678",
    poolIntId: "2",
    blockNumber: "123457",
    blockTimestamp: (Date.now() / 1000 - 7200).toString(), // 2 hours ago
    transactionHash: "0xfedcba",
    pool: {
      id: "0x789",
      poolIntId: "2",
      question: "Will Ethereum merge to PoS in 2024?",
      options: ["Yes", "No"],
      totalBets: "10000000",
      totalBetsByOption: ["8000000", "2000000"],
      selectedOption: null,
      status: PoolStatus.Pending,
      decisionDate: (Date.now() / 1000 + 86400 * 60).toString(), // 60 days from now
      betsCloseAt: (Date.now() / 1000 + 86400 * 30).toString(), // 30 days from now
      creatorId: "456",
      creatorName: "eth_enthusiast",
      imageUrl: "https://picsum.photos/201",
      chainId: "534351",
      chainName: "Scroll Sepolia",
      isDraw: false,
      xPostId: "789012",
      __typename: "Pool",
    },
    __typename: "Bet",
  },
];

// Create mocks for the Apollo Provider
const mocks = [
  {
    request: {
      query: GET_BETS,
      variables: {
        first: 10,
        filter: { user: "0x1234567890abcdef1234567890abcdef12345678" },
        orderBy: Bet_OrderBy.BlockTimestamp,
        orderDirection: OrderDirection.Desc,
      },
    },
    result: {
      data: {
        bets: mockBets,
      },
    },
  },
];

const meta: Meta<typeof UserBetsPage> = {
  title: "Pages/UserBetsPage",
  component: UserBetsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={mocks} addTypename={true}>
        <div className="bg-gray-950 text-white min-h-screen p-4">
          <Story />
        </div>
      </MockedProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserBetsPage>;

export const Default: Story = {
  args: {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    isSelf: false,
    chainConfig: CHAIN_CONFIG["534351"], // Scroll Sepolia
  },
};

export const Self: Story = {
  args: {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    isSelf: true,
    chainConfig: CHAIN_CONFIG["534351"], // Scroll Sepolia
  },
};

export const NoActivity: Story = {
  args: {
    address: "0x0000000000000000000000000000000000000000",
    isSelf: false,
    chainConfig: CHAIN_CONFIG["534351"], // Scroll Sepolia
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_BETS,
            variables: {
              first: 10,
              filter: { user: "0x0000000000000000000000000000000000000000" },
              orderBy: Bet_OrderBy.BlockTimestamp,
              orderDirection: OrderDirection.Desc,
            },
          },
          result: {
            data: {
              bets: [],
            },
          },
        },
      ],
    },
  },
};
