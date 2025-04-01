"use client";

import { useEmbeddedWallet } from "./EmbeddedWalletProvider";

export const useNetwork = () => {
  const { chainConfig } = useEmbeddedWallet();

  return {
    appAddress: "0xeb6AF2A4d7591C81A10114E8EB2b9b45f1bee60D",
    usdcAddress:
      chainConfig?.usdcAddress || "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    // For now, we'll use the same address for points as USDC since they're the same contract
    pointsAddress:
      chainConfig?.usdcAddress || "0xe4a063979014348Ae7D5811602Bebdd680ecf4e0",
  };
};
