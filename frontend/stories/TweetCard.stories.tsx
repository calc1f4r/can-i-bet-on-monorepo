import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TweetCard from "./TweetCard";

const queryClient = new QueryClient();

const meta: Meta<typeof TweetCard> = {
  title: "Components/TweetCard",
  component: TweetCard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof TweetCard>;

export const Default: Story = {
  args: {
    poolId: "1", // Example pool ID
  },
};
