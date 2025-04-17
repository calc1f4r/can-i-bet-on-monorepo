import type { Meta, StoryObj } from "@storybook/react"
import { Navbar } from "./Navbar"

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/pools",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const OnPoolsPage: Story = {
  args: {},
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/pools",
      },
    },
  },
}

export const OnCreatePoolPage: Story = {
  args: {},
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/pools/create",
      },
    },
  },
} 