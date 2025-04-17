"use client";

import { CHAIN_CONFIG } from "@/lib/config";
import { parseChainId } from "@/lib/utils";
import { usePrivy, useWallets, WalletWithMetadata } from "@privy-io/react-auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { baseSepolia } from "viem/chains";

// Extract ChainConfig type from CHAIN_CONFIG
type ChainConfig = (typeof CHAIN_CONFIG)[keyof typeof CHAIN_CONFIG];

// Define EIP1193Provider type
interface EIP1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

// Define the type for the embedded wallet
type EmbeddedWallet = WalletWithMetadata & {
  switchChain: (chainId: number) => Promise<void>;
  walletClientType: string;
  chainId: string | number;
  address: string;
  getEthereumProvider: () => Promise<EIP1193Provider>;
};

interface EmbeddedWalletContextType {
  embeddedWallet: EmbeddedWallet | null;
  chainConfig: ChainConfig | null;
  currentChainId: string;
  isLoading: boolean;
  switchChain: (chainId: number) => Promise<void>;
}

const EmbeddedWalletContext = createContext<EmbeddedWalletContextType>({
  embeddedWallet: null,
  chainConfig: null,
  currentChainId: "",
  isLoading: true,
  switchChain: async () => {},
});

export const useEmbeddedWallet = () => useContext(EmbeddedWalletContext);

export const EmbeddedWalletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { ready: privyReady } = usePrivy();
  const { ready: readyWallets, wallets } = useWallets();
  const [embeddedWallet, setEmbeddedWallet] = useState<EmbeddedWallet | null>(
    null
  );
  const [chainConfig, setChainConfig] = useState<ChainConfig | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Find the embedded wallet when wallets are ready
  useEffect(() => {
    if (readyWallets) {
      const wallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      ) as EmbeddedWallet | undefined;

      setEmbeddedWallet(wallet || null);
    }
  }, [readyWallets, wallets]);

  // Update chain ID and config when embedded wallet changes or its chain ID changes
  useEffect(() => {
    if (privyReady) {
      const chainId = embeddedWallet
        ? parseChainId(embeddedWallet.chainId)
        : parseChainId(baseSepolia.id);

      setCurrentChainId(chainId);

      // Get chain config for the current chain
      const config = CHAIN_CONFIG[chainId];
      setChainConfig(config || null);

      setIsLoading(false);
    }
  }, [embeddedWallet, privyReady]);

  // Function to switch chains
  const switchChain = async (chainId: number) => {
    if (embeddedWallet) {
      try {
        setIsLoading(true);
        await embeddedWallet.switchChain(chainId);
        const parsedChainId = parseChainId(chainId);
        setCurrentChainId(parsedChainId);
        setChainConfig(CHAIN_CONFIG[parsedChainId] || null);
      } catch (error) {
        console.error("Error switching chain:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const value = {
    embeddedWallet,
    chainConfig,
    currentChainId,
    isLoading,
    switchChain,
  };

  return (
    <EmbeddedWalletContext.Provider value={value}>
      {children}
    </EmbeddedWalletContext.Provider>
  );
};
