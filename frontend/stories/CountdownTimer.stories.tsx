import type { Meta, StoryObj } from '@storybook/react';
import { CountdownTimer, CountdownTimerProps } from './CountdownTimer';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Components/CountdownTimer',
  component: CountdownTimer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

// Helper function to get Unix timestamp for relative times
const getTimestamp = (minutesFromNow: number): number => {
  return Math.floor(Date.now() / 1000) + minutesFromNow * 60;
};

export const ShortTimeLeft: Story = {
  args: {
    betsCloseAt: getTimestamp(5), // 5 minutes from now
  },
};

export const LongTimeLeft: Story = {
  args: {
    betsCloseAt: getTimestamp(120), // 2 hours from now
  },
};

export const BettingClosed: Story = {
  args: {
    betsCloseAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  },
};

export const CustomStyling: Story = {
  args: {
    betsCloseAt: getTimestamp(30),
    className: 'text-2xl text-blue-500 font-bold',
  },
};

// Interactive story to demonstrate different states
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing countdown behavior. The timer updates every second.',
      },
    },
  },
  render: () => {
    // 15 minutes from now
    return <CountdownTimer betsCloseAt={getTimestamp(15)} />;
  },
}; 