import { GET_BETS, GET_BETS_SUBSCRIPTION } from "@/app/queries";
import { Bet, PoolStatus } from "@/lib/__generated__/graphql";
import { MockedProvider } from "@apollo/client/testing";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { Activity } from "./Activity";

// Create a mock bet generator function
const createMockBet = (index: number): Bet => {
  const now = Date.now();
  const timestamp = Math.floor((now - index * 5 * 60 * 1000) / 1000).toString(); // Each bet 5 minutes apart
  const optionIndex = Math.floor(Math.random() * 2).toString(); // 0 or 1 for YES/NO
  const options = ["YES", "NO"];
  const amount = (Math.floor(Math.random() * 100) + 1) * 1000000; // Random amount between $1-$100

  return {
    id: `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}`,
    betIntId: index.toString(),
    optionIndex,
    amount: amount.toString(),
    user: {
      __typename: "User",
      id: faker.finance.ethereumAddress(),
      address: faker.finance.ethereumAddress(),
      bets: [],
      lastLogin: undefined,
      loginStreak: undefined,
      lossStreak: undefined,
      totalLossAmount: undefined,
      totalLossCount: undefined,
      totalWinAmount: undefined,
      totalWinCount: undefined,
      winStreak: undefined
    },
    payoutClaimed: false, // Added missing required field
    userAddress: faker.finance.ethereumAddress(),
    poolIntId: Math.floor(Math.random() * 10).toString(),
    blockNumber: (10000000 + index).toString(),
    blockTimestamp: timestamp,
    transactionHash: `0x${faker.string
      .hexadecimal({ length: 64 })
      .substring(2)}`,
    chainId: "1",
    chainName: "Ethereum",
    createdAt: timestamp,
    updatedAt: timestamp,
    poolIdHex: `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}`,
    pool: {
      __typename: "Pool",
      id: `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}`,
      poolIntId: Math.floor(Math.random() * 10).toString(),
      question:
        faker.finance.currencyName() + " " + faker.company.buzzPhrase() + "?",
      options,
      totalBets: (Math.floor(Math.random() * 100) + 10).toString(),
      totalBetsByOption: ["5", "5"],
      selectedOption: "-1",
      status: PoolStatus.Pending,
      decisionDate: (Math.floor(now / 1000) + 86400 * 30).toString(), // 30 days in future
      betsCloseAt: (Math.floor(now / 1000) + 86400 * 15).toString(), // 15 days in future
      creatorId: faker.finance.ethereumAddress(),
      creatorName: faker.internet.userName(),
      imageUrl: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
      chainId: "1",
      chainName: "Ethereum",
      isDraw: false,
      xPostId: faker.string.numeric(10),
      category: faker.helpers.arrayElement([
        "Crypto",
        "Politics",
        "Sports",
        "Entertainment",
      ]),
      closureCriteria: "Manual resolution",
      closureInstructions: "The pool creator will resolve this bet",
      createdBlockNumber: "10000000",
      createdBlockTimestamp: (Math.floor(now / 1000) - 86400 * 5).toString(), // 5 days ago
      createdTransactionHash: `0x${faker.string
        .hexadecimal({ length: 64 })
        .substring(2)}`,
      gradedBlockNumber: "0",
      gradedBlockTimestamp: "0",
      gradedTransactionHash: "0x0",
      lastUpdatedBlockNumber: "10000000",
      lastUpdatedBlockTimestamp: (
        Math.floor(now / 1000) -
        86400 * 5
      ).toString(),
      lastUpdatedTransactionHash: `0x${faker.string
        .hexadecimal({ length: 64 })
        .substring(2)}`,
      bets: [],
    },
  };
};

// Generate an array of mock bets
const generateMockBets = (count: number): Bet[] => {
  return Array.from({ length: count }, (_, i) => createMockBet(i));
};

// Create mocks for both query and subscription
const createMocks = (
  bets: Bet[],
  filter?: { pool?: string },
  maxEntries: number = 10
) => {
  // If filter is provided, filter the bets
  const filteredBets = filter?.pool
    ? bets.filter((bet) => bet.pool.id === filter.pool)
    : bets;

  // Limit to maxEntries
  const limitedBets = filteredBets.slice(0, maxEntries);

  // Create query mock
  const queryMock = {
    request: {
      query: GET_BETS,
      variables: {
        first: maxEntries,
        filter,
      },
    },
    result: {
      data: {
        bets: limitedBets,
      },
    },
  };

  // Create subscription mock
  const subscriptionMock = {
    request: {
      query: GET_BETS_SUBSCRIPTION,
      variables: {
        filter,
      },
    },
    result: {
      data: {
        bets: limitedBets.length > 0 ? [limitedBets[0]] : [],
      },
    },
  };

  return [queryMock, subscriptionMock];
};

const meta: Meta<typeof Activity> = {
  title: "Components/Activity",
  component: Activity,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      const { args } = context;
      const mockBets = generateMockBets(10);
      const mocks = createMocks(
        mockBets,
        args.poolId ? { pool: args.poolId } : undefined,
        args.maxEntries || 10
      );

      return (
        <MockedProvider mocks={mocks} addTypename={false}>
          <div className="w-full max-w-2xl">
            <Story />
          </div>
        </MockedProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Activity>;

export const Default: Story = {
  args: {
    maxEntries: 10,
  },
};

export const WithPoolFilter: Story = {
  args: {
    maxEntries: 5,
    poolId: `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}`,
  },
};

export const HideQuestion: Story = {
  args: {
    maxEntries: 5,
    showQuestion: false,
  },
};

export const NoResults: Story = {
  decorators: [
    (Story) => {
      const emptyMocks = [
        {
          request: {
            query: GET_BETS,
            variables: {
              first: 10,
              filter: {},
            },
          },
          result: {
            data: {
              bets: [],
            },
          },
        },
        {
          request: {
            query: GET_BETS_SUBSCRIPTION,
            variables: {
              filter: {},
            },
          },
          result: {
            data: {
              bets: [],
            },
          },
        },
      ];

      return (
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <div className="w-full max-w-2xl">
            <Story />
          </div>
        </MockedProvider>
      );
    },
  ],
  args: {
    maxEntries: 10,
  },
};
