"use client";
import { addressToBackgroundColor } from "@/lib/utils";
import Image from "next/image";
import { FC, memo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

type PlayerAddressChipProps = {
  address: string;
  showAvatar?: boolean;
  avatarImageUrl?: string;
  variant?: "xs" | "small" | "default" | "large";
  className?: string;
};

const avatarVariants = {
  xs: {
    jazziconDiam: 14,
    imgSize: 4,
    avatarClass: "w-4 h-4 rounded-full",
    linkClass: "flex items-center space-x-0.5 text-xs",
    textClass:
      "font-mono px-1.5 py-0.5 rounded hover:underline text-xs leading-normal inline-flex items-center align-middle",
    text: (address: string) => address.slice(2, 8),
  },
  small: {
    jazziconDiam: 18,
    imgSize: 5,
    avatarClass: "w-5 h-5 rounded-full",
    linkClass: "flex items-center space-x-1 text-sm",
    textClass: "font-mono px-1.5 py-0.5 rounded hover:underline text-sm",
    text: (address: string) => address.slice(2, 8),
  },
  default: {
    jazziconDiam: 26,
    imgSize: 7,
    avatarClass: "w-7 h-7 rounded-full",
    linkClass: "flex items-center space-x-1",
    textClass: "font-mono px-2 py-1 rounded hover:underline text-base",
    text: (address: string) => address.slice(0, 8),
  },
  large: {
    jazziconDiam: 34,
    imgSize: 9,
    avatarClass: "w-9 h-9 rounded-full",
    linkClass: "flex items-center space-x-1",
    textClass: "font-mono px-2.5 py-1.5 rounded hover:underline text-lg",
    text: (address: string) => address.slice(0, 6) + "..." + address.slice(-4),
  },
};

const PlayerAddressChipComponent: FC<PlayerAddressChipProps> = ({
  address,
  showAvatar,
  avatarImageUrl,
  variant = "default",
  className = "",
}) => {
  const config = avatarVariants[variant];
  //TODO Support user avatars
  let avatar = (
    <Jazzicon
      diameter={config.jazziconDiam}
      seed={jsNumberForAddress(String(address))}
    />
  );

  if (avatarImageUrl) {
    avatar = (
      <Image
        src={avatarImageUrl}
        alt={"avatar"}
        className={config.avatarClass}
      />
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showAvatar && avatar}
      <span
        className={config.textClass}
        style={{ backgroundColor: addressToBackgroundColor(address) }}
      >
        {config.text(address)}
      </span>
    </div>
  );
};
export const PlayerAddressChip = memo(PlayerAddressChipComponent);
