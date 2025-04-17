import { FollowXButton } from "@/components/FollowXButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FollowXButton> = {
  title: "Components/FollowXButton",
  component: FollowXButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    username: {
      control: "text",
      description: "X (Twitter) username without the @ symbol",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FollowXButton>;

export const Default: Story = {
  args: {
    username: "CanIBetOn",
  },
};

export const CustomText: Story = {
  args: {
    username: "CanIBetOn",
    children: "Join us on X",
  },
};

export const CustomStyle: Story = {
  args: {
    username: "CanIBetOn",
    className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
  },
};
