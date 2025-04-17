"use client";

import { CHAIN_CONFIG } from "@/lib/config";
import { useChainId } from "wagmi";

export const useNetwork = () => {
  const chainId = useChainId();
  const chainConfig = CHAIN_CONFIG[chainId];

  return {
    ...chainConfig,
  };
};
