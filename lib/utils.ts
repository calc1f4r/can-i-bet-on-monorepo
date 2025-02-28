import { useWallets } from "@privy-io/react-auth";
import { clsx, type ClassValue } from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";
import { base } from "viem/chains";
import { Pool, PoolStatus } from "./__generated__/graphql";
import { CHAIN_CONFIG } from "./config";
export const USDC_DECIMALS = 6;

export enum FrontendPoolStatus {
  Pending = "pending",
  Grading = "grading",
  Graded = "graded",
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

export const addressToBackgroundColor = (address: string) => {
  const hash = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 50%, 50%)`;
};

export function generateRandomColor(isLight: boolean) {
  const hue = Math.random() * 360;
  const saturation = 50 + Math.random() * 50; // 50-100%
  const lightness = isLight ? 60 + Math.random() * 30 : 10 + Math.random() * 30; // 60-90% for light, 10-40% for dark

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return hslToHex(hue, saturation, lightness);
}

export function usdcAmountToDollars(
  amount: number | string,
  includePrefix: boolean = true
): string {
  let amountValue;
  if (typeof amount === "string") {
    amountValue = parseInt(amount);
  } else {
    amountValue = amount;
  }
  const formattedAmount = (amountValue / Math.pow(10, USDC_DECIMALS)).toFixed(
    0
  );
  return includePrefix ? `$${formattedAmount}` : formattedAmount;
}

//TODO Redundant
export function usdcAmountToDollarsNumber(amount: number | string): number {
  let amountValue;
  if (typeof amount === "string") {
    amountValue = parseInt(amount);
  } else {
    amountValue = amount;
  }
  return Math.round(amountValue / Math.pow(10, USDC_DECIMALS));
}

export const bigintToHexString = (n: bigint) => {
  return n.toString(16);
};

export const shame = (t: string) => {
  return t.indexOf("0x0") === 0 ? t : `0x0${t}`;
};

export const parseChainId = (chainId: number | string): string => {
  let parsedChainId = chainId;
  if (typeof chainId === "string") {
    parsedChainId = chainId.replace("eip155:", "");
  }

  // If chain config doesn't exist, fallback to Base Sepolia
  // TODO Disgusting
  if (!CHAIN_CONFIG[parsedChainId]) {
    parsedChainId = 84532;
  }

  return String(parsedChainId);
};

export const getFrontendPoolStatus = (
  poolStatus: Pool["status"],
  betsCloseAt: number
) => {
  const now = new Date().getTime();
  if (poolStatus === PoolStatus.Pending && betsCloseAt * 1000 > now) {
    return FrontendPoolStatus.Pending;
  }

  if (poolStatus === PoolStatus.Pending && betsCloseAt * 1000 < now) {
    return FrontendPoolStatus.Grading;
  }

  if (poolStatus === PoolStatus.Graded) {
    return FrontendPoolStatus.Graded;
  }
};

export const useCurrentChainId = (): [
  string,
  Dispatch<SetStateAction<string>>
] => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  )!;
  const chainId = embeddedWallet
    ? parseChainId(embeddedWallet.chainId)
    : parseChainId(base.id);

  return useState<string>(chainId);
};
