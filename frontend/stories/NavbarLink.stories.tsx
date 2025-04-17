import type { Meta, StoryObj } from "@storybook/react"
import { NavbarLink } from "./NavbarLink"

const meta = {
  title: "Navigation/NavbarLink",
  component: NavbarLink,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/pools",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavbarLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: "/pools",
    children: "Browse pools",
  },
}

export const Active: Story = {
  args: {
    href: "/pools",
    children: "Browse pools",
  },
}

export const Inactive: Story = {
  args: {
    href: "/pools/create",
    children: "Create pool",
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/different-path",
      },
    },
  },
} 