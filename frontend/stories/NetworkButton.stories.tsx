import type { Meta, StoryObj } from "@storybook/react";
import { arbitrum, arbitrumSepolia, base, baseSepolia } from "viem/chains";
import { NetworkButton } from "./NetworkButton";

const meta: Meta<typeof NetworkButton> = {
  title: "Components/NetworkButton",
  component: NetworkButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "small"],
    },
    selected: {
      control: "boolean",
    },
    chainId: {
      control: "select",
      options: [baseSepolia.id, base.id, arbitrum.id, arbitrumSepolia.id],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkButton>;

export default meta;
type Story = StoryObj<typeof NetworkButton>;

export const BaseSepolia: Story = {
  args: {
    chainId: baseSepolia.id,
    size: "default",
    selected: false,
  },
};

export const BaseSepoliaSelected: Story = {
  args: {
    ...BaseSepolia.args,
    selected: true,
  },
};

export const BaseMainnet: Story = {
  args: {
    chainId: base.id,
    size: "default",
    selected: false,
  },
};

export const ArbitrumMainnet: Story = {
  args: {
    chainId: arbitrum.id,
    size: "default",
    selected: false,
  },
};

export const ArbitrumSepolia: Story = {
  args: {
    chainId: arbitrumSepolia.id,
    size: "default",
    selected: false,
  },
};

export const Small: Story = {
  args: {
    chainId: base.id,
    size: "small",
    selected: false,
  },
};

export const SmallSelected: Story = {
  args: {
    ...Small.args,
    selected: true,
  },
};
