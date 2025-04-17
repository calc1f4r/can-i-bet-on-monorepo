import type { Meta, StoryObj } from "@storybook/react";
import Tweet from "./Tweet";

const meta: Meta<typeof Tweet> = {
  title: "Components/Tweet",
  component: Tweet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A component that embeds Twitter/X posts using the Twitter widget.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: "text",
      description: "The ID of the tweet to embed",
      type: { name: "string", required: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tweet>;

export const Default: Story = {
  args: {
    // Example tweet from Twitter's official account
    id: "1893049568805486621",
  },
};

export const LongThread: Story = {
  args: {
    // Example of a tweet that's part of a thread
    id: "1894085659263951232",
  },
};

export const WithMedia: Story = {
  args: {
    // Example tweet containing media (image/video)
    id: "1894094861931778280",
  },
};

export const WithPoll: Story = {
  args: {
    // Example tweet containing a poll
    id: "1826015426658415033",
  },
};

// Example of testing error handling with an invalid ID
export const InvalidTweet: Story = {
  args: {
    id: "invalid-id",
  },
};

// Add decorators to simulate different viewport sizes
export const MobileView: Story = {
  args: {
    id: "1649191520250245121",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// Add play function to test widget loading
export const LoadingTest: Story = {
  args: {
    id: "1649191520250245121",
  },
  play: async ({ canvasElement }) => {
    // Wait for widget to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify tweet container exists
    const tweetContainer = canvasElement.querySelector(".twitter-tweet");
    if (!tweetContainer) {
      throw new Error("Tweet container not found");
    }
  },
};
