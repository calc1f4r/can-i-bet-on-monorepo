import { PoolStatus } from "@/lib/__generated__/graphql";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import BetCard from "./BetCard";

const meta: Meta<typeof BetCard> = {
  title: "Components/BetCard",
  component: BetCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BetCard>;

// Updated Pool type to match GetPoolsQuery
const defaultPool = {
  __typename: "Pool" as const,
  id: "0x1234567890abcdef",
  poolIntId: "1",
  question: "Will Bitcoin reach $100,000 by end of 2024?",
  options: ["Yes", "No"],
  totalBets: "80000",
  totalBetsByOption: ["50000", "30000"],
  selectedOption: "-1",
  status: PoolStatus.Pending,
  imageUrl: "https://picsum.photos/200",
  category: "crypto",
  creatorName: "@cryptoexpert",
  creatorId: "123456789",
  closureCriteria: "December 31st, 2024 23:59:59 UTC",
  closureInstructions: "Check BTC/USD price on Coinbase Pro",
  betsCloseAt: "1735689599", // Dec 31, 2024
  decisionDate: "1735689600", // Jan 1, 2025
  isDraw: false,
  createdBlockNumber: "1",
  createdBlockTimestamp: "1709558400", // March 4, 2024
  createdTransactionHash: "0x1234567890abcdef",
  lastUpdatedBlockNumber: "1",
  lastUpdatedBlockTimestamp: "1709558400",
  lastUpdatedTransactionHash: "0x1234567890abcdef",
  gradedBlockNumber: "0",
  gradedBlockTimestamp: "0",
  gradedTransactionHash: "0x0000000000000000000000000000000000000000",
  chainId: "534351",
  chainName: "scroll-sepolia",
  xPostId: "1893049568805486621",
};

export const Default: Story = {
  args: {
    pool: defaultPool,
  },
};

export const WithSelectedOption: Story = {
  args: {
    pool: {
      ...defaultPool,
      selectedOption: "0",
    },
  },
};

export const HighVolume: Story = {
  args: {
    pool: {
      ...defaultPool,
      question: "Will AI surpass human intelligence by 2030?",
      creatorName: "@futurist",
      totalBetsByOption: ["750000", "250000"],
      totalBets: "1000000",
    },
  },
};

export const LongQuestion: Story = {
  args: {
    pool: {
      ...defaultPool,
      question:
        "Will the European Union successfully implement comprehensive AI regulation frameworks that balance innovation and ethical concerns while maintaining competitive advantage against other global markets by 2025?",
      creatorName: "@techpolicy",
      totalBetsByOption: ["150000", "100000"],
      totalBets: "250000",
    },
  },
};

export const InteractiveBetting: Story = {
  render: function Render() {
    const [pool, setPool] = useState({
      ...defaultPool,
      question: "Interactive Betting Demo",
      creatorName: "@demouser",
    });

    return (
      <div className="space-y-4">
        <BetCard pool={pool} />
        <p className="text-sm text-muted-foreground text-center">
          Click the options to toggle selection
        </p>
      </div>
    );
  },
};

export const AnimatedNumbers: Story = {
  render: function Render() {
    const [pool, setPool] = useState(defaultPool);

    const randomizeStats = useCallback(() => {
      const yes = Math.floor(Math.random() * 2000000);
      const no = Math.floor(Math.random() * 2000000);
      setPool((prev) => ({
        ...prev,
        totalBetsByOption: [String(yes), String(no)],
        totalBets: String(yes + no),
      }));
    }, []);

    return (
      <div className="space-y-4">
        <BetCard pool={pool} />
        <button
          onClick={randomizeStats}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Randomize Numbers
        </button>
      </div>
    );
  },
};
