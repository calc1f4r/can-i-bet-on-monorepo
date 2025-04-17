import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FiDollarSign, FiHeart, FiUser } from "react-icons/fi";
import IconsWithNumbers, {
  CommentsWithIcon,
  LikesWithIcon,
  RetweetsWithIcon,
  VolumeWithIcon,
} from "./IconsWithNumbers";

const meta: Meta<typeof IconsWithNumbers> = {
  title: "Components/IconsWithNumbers",
  component: IconsWithNumbers,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: {
        type: "select",
        options: ["heart", "user", "dollar"],
      },
      mapping: {
        heart: FiHeart,
        user: FiUser,
        dollar: FiDollarSign,
      },
    },
    number: { control: "number" },
    abbreviateNumbers: { control: "boolean" },
    prefix: { control: "text" },
    suffix: { control: "text" },
    size: { control: "number" },
    decimalPlaces: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IconsWithNumbers>;

export const Default: Story = {
  args: {
    icon: FiHeart,
    number: 1234,
    abbreviateNumbers: false,
    prefix: "",
    suffix: "",
    size: 15,
    decimalPlaces: 0,
  },
};

export const Abbreviated: Story = {
  args: {
    icon: FiUser,
    number: 1234567,
    abbreviateNumbers: true,
    decimalPlaces: 1,
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    icon: FiDollarSign,
    number: 9876.543,
    prefix: "$",
    suffix: " USD",
    decimalPlaces: 2,
  },
};

export const Volume: Story = {
  render: () => <VolumeWithIcon number={1234567} />,
};

export const Likes: Story = {
  render: () => <LikesWithIcon number={7001} />,
};

export const Retweets: Story = {
  render: () => <RetweetsWithIcon number={8432} />,
};

export const Comments: Story = {
  render: () => <CommentsWithIcon number={9999} />,
};

export const SmallNumbers: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <VolumeWithIcon number={500} />
      <LikesWithIcon number={750} />
      <RetweetsWithIcon number={999} />
      <CommentsWithIcon number={1001} />
    </div>
  ),
};

export const AnimatedExample: Story = {
  render: function Render() {
    const [count, setCount] = useState(1000);

    return (
      <div className="space-y-4">
        <IconsWithNumbers
          icon={FiHeart}
          number={count}
          abbreviateNumbers={true}
          decimalPlaces={1}
        />
        <div className="space-x-2">
          <button
            onClick={() => setCount((c) => c + 500)}
            className="px-2 py-1 bg-primary text-primary-foreground rounded"
          >
            Add 500
          </button>
          <button
            onClick={() => setCount((c) => Math.max(0, c - 500))}
            className="px-2 py-1 bg-primary text-primary-foreground rounded"
          >
            Subtract 500
          </button>
        </div>
      </div>
    );
  },
};

export const MultipleAnimatedExample: Story = {
  render: function Render() {
    const [numbers, setNumbers] = useState({
      volume: 10000,
      likes: 1500,
      retweets: 750,
      comments: 250,
    });

    const randomizeAll = () => {
      setNumbers({
        volume: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 10000),
        retweets: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 2000),
      });
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <VolumeWithIcon number={numbers.volume} />
          <LikesWithIcon number={numbers.likes} />
          <RetweetsWithIcon number={numbers.retweets} />
          <CommentsWithIcon number={numbers.comments} />
        </div>
        <button
          onClick={randomizeAll}
          className="px-2 py-1 bg-primary text-primary-foreground rounded"
        >
          Randomize Numbers
        </button>
      </div>
    );
  },
};
