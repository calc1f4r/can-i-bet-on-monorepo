import {
  default as scrollIcon,
  default as scrollSepoliaIcon,
} from "@/stories/assets/crypto/scroll-full.svg";
import usdpLogo from "@/stories/assets/usdp-logo.svg";
import { Chain, scroll, scrollSepolia } from "viem/chains";

export type ChainConfig = {
  chain: Chain;
  applicationContractAddress: `0x${string}`;
  iconUrl: string;
  backgroundColor: string;
  usdcAddress: `0x${string}`;
  nativeCurrency: {
    symbol: string;
  };
  usdcPrefix: string | { src: string; width?: number; height?: number };
};

// chainId -> per-chain config
// CHANGEME WHEN ADDING A NEW CHAIN OR DEPLOYING A NEW CONTRACT
export const CHAIN_CONFIG: Record<string, ChainConfig> = {
  [scrollSepolia.id]: {
    chain: scrollSepolia,
    applicationContractAddress: "0x2866B287F871F90A0494929877D575D1bA02d342",
    iconUrl: scrollSepoliaIcon,
    backgroundColor: "#FFF",
    usdcAddress: "0xe4a063979014348Ae7D5811602Bebdd680ecf4e0",
    nativeCurrency: {
      symbol: "ETH",
    },
    usdcPrefix: { src: usdpLogo, width: 20, height: 20 },
  },
  [scroll.id]: {
    chain: scroll,
    applicationContractAddress: "0x2866B287F871F90A0494929877D575D1bA02d342",
    iconUrl: scrollIcon,
    backgroundColor: "#FFF",
    usdcAddress: "0xe4a063979014348Ae7D5811602Bebdd680ecf4e0",
    nativeCurrency: {
      symbol: "ETH",
    },
    usdcPrefix: "$",
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
