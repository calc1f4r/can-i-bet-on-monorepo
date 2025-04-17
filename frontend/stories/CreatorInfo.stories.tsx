import type { Meta, StoryObj } from "@storybook/react";
import { CreatorInfo } from "./CreatorInfo";

const meta: Meta<typeof CreatorInfo> = {
  title: "Components/CreatorInfo",
  component: CreatorInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    creatorId: {
      control: "text",
      description:
        "Unique identifier for the creator, used to generate the avatar",
    },
    creatorName: {
      control: "text",
      description: "Display name of the creator",
    },
    className: {
      control: "text",
      description: "Optional CSS classes to apply to the container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CreatorInfo>;

export const Default: Story = {
  args: {
    creatorId: "123456",
    creatorName: "John Doe",
  },
};

export const LongName: Story = {
  args: {
    creatorId: "789012",
    creatorName: "This is a very long creator name that should be truncated",
  },
};

export const CustomClassName: Story = {
  args: {
    creatorId: "345678",
    creatorName: "Jane Smith",
    className: "bg-slate-100 p-4 rounded-lg",
  },
};

export const DifferentSeed: Story = {
  args: {
    creatorId: "901234",
    creatorName: "Bob Wilson",
  },
};

// Example of testing empty/invalid states
export const EmptyId: Story = {
  args: {
    creatorId: "",
    creatorName: "Creator with no ID",
  },
};
