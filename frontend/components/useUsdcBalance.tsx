import { betPointsAbi } from "@/lib/contract.types";
import { USDC_DECIMALS } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useEmbeddedWallet } from "./EmbeddedWalletProvider";
import { useTokenContext } from "./TokenContext";

export const useUsdcBalance = () => {
  const { tokenAddress } = useTokenContext();
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    embeddedWallet,
    currentChainId,
    chainConfig,
    isLoading: isWalletLoading,
  } = useEmbeddedWallet();
  const { ready: walletsReady } = useWallets();

  const fetchTokenBalance = useCallback(async () => {
    // Reset state at the beginning of each fetch attempt
    setError(null);

    // Check if wallet is ready and chain has been initialized
    if (!walletsReady || isWalletLoading) {
      return;
    }

    if (!embeddedWallet) {
      setTokenBalance("0");
      return;
    }

    if (!currentChainId) {
      setError("No chain ID available");
      setTokenBalance("0");
      return;
    }

    if (!chainConfig) {
      setError(`No chain configuration found for chain ID: ${currentChainId}`);
      setTokenBalance("0");
      return;
    }

    try {
      setIsLoadingBalance(true);

      // Get provider from wallet
      const provider = await embeddedWallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);

      // Create contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        betPointsAbi,
        ethersProvider
      );

      try {
        // Get balance
        const balance = await tokenContract.balanceOf(embeddedWallet.address);

        // Format balance (assuming 6 decimals for USDC)
        const formattedBalance = ethers.formatUnits(balance, USDC_DECIMALS);
        // Remove all decimal places by parsing to float and then to integer
        setTokenBalance(Math.floor(parseFloat(formattedBalance)).toString());
      } catch (contractError) {
        // Handle the specific "could not decode result data" error
        if (
          contractError instanceof Error &&
          (contractError.message.includes("could not decode result data") ||
            contractError.message.includes("BAD_DATA"))
        ) {
          // This is an expected error when a user has no balance
          // No need to log as an error since it's a normal condition
          if (process.env.NODE_ENV === "development") {
            console.log("No USDC balance found for address - setting to 0");
          }
          setTokenBalance("0");
        } else {
          // Only log unexpected contract errors
          console.error(
            "Unexpected contract interaction error:",
            contractError
          );
          // Rethrow for the outer catch block to handle other contract errors
          throw contractError;
        }
      }
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes("contract not deployed")) {
          setError(`Token contract not deployed at address: ${tokenAddress}`);
        } else if (error.message.includes("network changed")) {
          setError("Network changed during balance fetch. Please try again.");
        } else if (error.message.includes("user rejected")) {
          setError("Request was rejected by the user");
        } else if (error.message.includes("insufficient funds")) {
          setError("Insufficient funds for transaction");
        } else if (
          error.message.includes("could not decode result data") ||
          error.message.includes("BAD_DATA")
        ) {
          // This is now handled in the inner try/catch, but keep as fallback
          setTokenBalance("0");
          // Don't set an error for this case as it's expected when there's no balance
        } else {
          setError(`Failed to fetch token balance: ${error.message}`);
        }
      } else {
        setError("Unknown error occurred while fetching USDC balance");
      }

      // Always ensure we have a balance value in case of errors
      setTokenBalance((current) => (current === null ? "0" : current));
    } finally {
      setIsLoadingBalance(false);
    }
  }, [
    embeddedWallet,
    currentChainId,
    chainConfig,
    walletsReady,
    isWalletLoading,
    tokenAddress,
  ]);

  // Trigger a balance fetch when dependencies change
  useEffect(() => {
    // Only fetch if wallets are ready and wallet loading is complete
    if (walletsReady && !isWalletLoading) {
      fetchTokenBalance();
    }
  }, [fetchTokenBalance, walletsReady, isWalletLoading, currentChainId]);

  // Set up polling interval for balance updates
  useEffect(() => {
    // Only set up polling if wallets are ready and wallet loading is complete
    if (!walletsReady || isWalletLoading) return;

    const intervalId = setInterval(fetchTokenBalance, 5000);
    return () => clearInterval(intervalId);
  }, [fetchTokenBalance, walletsReady, isWalletLoading]);

  return {
    usdcBalance: tokenBalance,
    isLoadingBalance,
    error,
    refetch: fetchTokenBalance,
  };
};
