import { GET_POOL } from "@/app/queries";
import { Pool, PoolStatus } from "@/lib/__generated__/graphql";
import { MockedProvider } from "@apollo/client/testing";
import type { Meta, StoryObj } from "@storybook/react";
import { CurrentSpreadCard } from "./CurrentSpreadCard";

const mockPool: Pool = {
  __typename: "Pool",
  id: "0x01",
  poolIntId: "1",
  question: "What is the capital of France?",
  options: ["Paris", "London"],
  usdcVolume: "3000000",
  pointsVolume: "0",
  usdcBetTotalsByOption: ["1000000", "2000000"],
  pointsBetTotalsByOption: ["0", "0"],
  selectedOption: "0",
  status: PoolStatus.Pending,
  decisionTime: "1735689600", // Dec 31, 2024
  betsCloseAt: "1735603200", // Dec 30, 2024
  creatorId: "0xdef456abc789def456abc789def456abc789def4",
  creatorName: "Geography Expert",
  imageUrl: "https://example.com/paris.jpg",
  chainId: "1",
  chainName: "Ethereum",
  isDraw: false,
  xPostId: "1234567890",
  category: "Geography",
  closureCriteria: "Manual resolution",
  closureInstructions: "The pool creator will resolve this bet",
  bets: [],
  createdBlockNumber: "100000",
  createdBlockTimestamp: "1625097600",
  createdTransactionHash: "0xabc123",
  gradedBlockNumber: "0",
  gradedBlockTimestamp: "0",
  gradedTransactionHash: "0x0",
  lastUpdatedBlockNumber: "100000",
  lastUpdatedBlockTimestamp: "1625097600",
  lastUpdatedTransactionHash: "0xabc123",
};

const mocks = [
  {
    request: {
      query: GET_POOL,
      variables: { poolId: "0x01" },
    },
    result: {
      data: {
        pool: mockPool,
      },
    },
  },
];

const meta: Meta<typeof CurrentSpreadCard> = {
  title: "Components/CurrentSpreadCard",
  component: CurrentSpreadCard,
  decorators: [
    (Story) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <Story />
      </MockedProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showTitle: {
      control: "boolean",
      description: "Whether to show the card title",
      defaultValue: false,
    },
    cardClassName: {
      control: "text",
      description: "Custom class name for the card",
      defaultValue: "w-full max-w-md mx-auto",
    },
    showTotalBets: {
      control: "boolean",
      description: "Whether to show the total bets section",
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CurrentSpreadCard>;

export const Default: Story = {
  args: {
    pool: mockPool,
    showTitle: false,
  },
};

export const WithTitle: Story = {
  args: {
    pool: mockPool,
    showTitle: true,
  },
};

export const WithoutTotalBets: Story = {
  args: {
    pool: mockPool,
    showTitle: true,
    showTotalBets: false,
  },
};

export const CustomClassName: Story = {
  args: {
    pool: mockPool,
    showTitle: true,
    cardClassName: "w-full max-w-sm mx-auto bg-slate-800 border-slate-700",
  },
};

export const WithPoolId: Story = {
  args: {
    poolId: "0x01",
    showTitle: true,
  },
};

export const Loading: Story = {
  args: {
    poolId: "0x02", // Different poolId to trigger loading state
    loading: true,
  },
};
