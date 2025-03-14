import { GET_POOL } from "@/app/queries";
import { GetPoolsQuery, PoolStatus } from "@/lib/__generated__/graphql";
import { ApolloError } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import type { Meta, StoryObj } from "@storybook/react";
import { PlaceBetCard } from "./PlaceBetCard";

const mockPool1 = {
  id: "0x01",
  poolIntId: "1",
  question: "What is the capital of France?",
  options: ["Paris", "London"],
  totalBets: "2000000",
  totalBetsByOption: ["0", "2000000"],
  selectedOption: "-1",
  status: PoolStatus.Pending,
  imageUrl: "https://picsum.photos/200",
  category: "geography",
  creatorName: "@geographer",
  creatorId: "123",
  closureCriteria: "When verified by multiple sources",
  closureInstructions: "Check official geographic records",
  betsCloseAt: "1735689599",
  decisionDate: "1735689600",
  isDraw: false,
  createdBlockNumber: "1",
  createdBlockTimestamp: "1709558400",
  createdTransactionHash: "0x123",
  lastUpdatedBlockNumber: "1",
  lastUpdatedBlockTimestamp: "1709558400",
  lastUpdatedTransactionHash: "0x123",
  gradedBlockNumber: "0",
  gradedBlockTimestamp: "0",
  gradedTransactionHash: "0x0",
  xPostId: "123",
  chainId: "534351",
  chainName: "base-sepolia",
} satisfies GetPoolsQuery["pools"][0];

const mockPool3 = {
  id: "0x03",
  poolIntId: "1",
  question: "What is the capital of France?",
  options: ["Paris", "London"],
  totalBets: "5000000",
  totalBetsByOption: ["3000000", "2000000"],
  selectedOption: "-1",
  status: PoolStatus.Pending,
  imageUrl: "https://picsum.photos/200",
  category: "geography",
  creatorName: "@geographer",
  creatorId: "123",
  closureCriteria: "When verified by multiple sources",
  closureInstructions: "Check official geographic records",
  betsCloseAt: "1735689599",
  decisionDate: "1735689600",
  isDraw: false,
  createdBlockNumber: "1",
  createdBlockTimestamp: "1709558400",
  createdTransactionHash: "0x123",
  lastUpdatedBlockNumber: "1",
  lastUpdatedBlockTimestamp: "1709558400",
  lastUpdatedTransactionHash: "0x123",
  gradedBlockNumber: "0",
  gradedBlockTimestamp: "0",
  gradedTransactionHash: "0x0",
  xPostId: "123",
  chainId: "534351",
  chainName: "base-sepolia",
} satisfies GetPoolsQuery["pools"][0];

const mocks = [
  {
    request: {
      query: GET_POOL,
      variables: { poolId: "0x01" },
    },
    result: {
      data: {
        pool: mockPool1,
      },
    },
  },
  {
    request: {
      query: GET_POOL,
      variables: { poolId: "0x03" },
    },
    result: {
      data: {
        pool: mockPool3,
      },
    },
  },
];

const meta: Meta<typeof PlaceBetCard> = {
  title: "Components/SimulateBets",
  component: PlaceBetCard,
  decorators: [
    (Story) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <div data-testid="mock-wallet-context">
          <Story />
        </div>
      </MockedProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    mockData: {
      wallets: {
        ready: true,
        wallets: [
          {
            address: "0x1234567890123456789012345678901234567890",
            chainId: "534351",
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceBetCard>;

export const Default: Story = {
  args: {
    pool: mockPool1,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    pool: undefined,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    pool: mockPool3,
    loading: false,
    queryError: new ApolloError({ errorMessage: "Failed to fetch pool data" }),
  },
};
