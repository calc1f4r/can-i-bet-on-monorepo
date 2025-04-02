import baseSepoliaIcon from "@/stories/assets/crypto/base-full.svg";
import usdpLogo from "@/stories/assets/usdp-logo.svg";
import { baseSepolia, Chain } from "viem/chains";

export const DEFAULT_CHAIN_ID = baseSepolia.id;

export type ChainConfig = {
  chain: Chain;
  appAddress: `0x${string}`;
  iconUrl: string;
  backgroundColor: string;
  usdcAddress: `0x${string}`;
  pointsAddress: `0x${string}`;
  nativeCurrency: {
    symbol: string;
  };
  usdcPrefix: string | { src: string; width?: number; height?: number };
};

// chainId -> per-chain config
// CHANGEME WHEN ADDING A NEW CHAIN OR DEPLOYING A NEW CONTRACT
export const CHAIN_CONFIG: Record<string, ChainConfig> = {
  [baseSepolia.id]: {
    chain: baseSepolia,
    appAddress: "0x75F788D02a0D63b9B8454A61f4c32f6cf4f533f9",
    iconUrl: baseSepoliaIcon,
    backgroundColor: "#FFF",
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    pointsAddress: "0xC6898dbD7F9306Ddabc7850584534EF798C7Ceb2",
    nativeCurrency: {
      symbol: "ETH",
    },
    usdcPrefix: { src: usdpLogo, width: 20, height: 20 },
  },
};

export const MAX_OPTIONS = 5;

export const optionColor: Array<string> = [
  "option-a",
  "option-b",
  "option-c",
  "option-d",
  "option-e",
];

export interface OptionColorClasses {
  backgroundColor: string;
  border: string;
  text: string;
}

export const optionColorClasses: Record<number, OptionColorClasses> = {
  0: {
    backgroundColor: "bg-option-a",
    border: "border-option-a",
    text: "text-option-a",
  },
  1: {
    backgroundColor: "bg-option-b",
    border: "border-option-b",
    text: "text-option-b",
  },
  2: {
    backgroundColor: "bg-option-c",
    border: "border-option-c",
    text: "text-option-c",
  },
  3: {
    backgroundColor: "bg-option-d",
    border: "border-option-d",
    text: "text-option-d",
  },
  4: {
    backgroundColor: "bg-option-e",
    border: "border-option-e",
    text: "text-option-e",
  },
};
