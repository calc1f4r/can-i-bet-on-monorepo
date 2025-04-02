"use client";
//TODO Doesn't support Option A or B, hardcoded to Yes and No
import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import { useTokenContext } from "@/components/TokenContext";
import { useUsdcBalance } from "@/components/useUsdcBalance";
import { placeBet, topUpUsdcBalance } from "@/lib/betting";
import { MAX_OPTIONS, optionColor, OptionColorClasses } from "@/lib/config";
import { cn, parseChainId, usdcAmountToDollars } from "@/lib/utils";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { toast } from "sonner";

type BetButtonProps = {
  option: string;
  optionIndex: number;
  colorClassnames: OptionColorClasses;
  isSelected?: boolean;
  poolId: string;
  chainId: string | number;
  /**
   * @deprecated This prop is deprecated and will be removed in a future version.
   * The button's disabled state is now handled internally based on loading state.
   */
  disabled?: boolean;
  amount: string;
  // New props for earnings calculation
  totalBetsByOption?: string[];
  totalBets?: string;
};

export const BetButton = ({
  option,
  optionIndex,
  colorClassnames,
  poolId,
  chainId,
  disabled,
  amount,
  totalBetsByOption = [],
  totalBets = "0",
}: BetButtonProps) => {
  const { tokenLogo, tokenType } = useTokenContext();
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated } = usePrivy();
  const { chainConfig } = useEmbeddedWallet();
  const { embeddedWallet } = useEmbeddedWallet();
  const { refetch: fetchUsdcBalance } = useUsdcBalance();

  const { login } = useLogin({
    onComplete: async ({ user }) => {
      console.log("login complete", embeddedWallet, user);
      const result = await topUpUsdcBalance({
        chainId: parseChainId("534351"),
        walletAddress: user.wallet?.address || "",
      });

      if (!result.success) {
        if (result.error && result.rateLimitReset) {
          // Rate limited case - log but don't escalate
          console.log(
            `USDC top-up rate limited: ${result.error}. Available again in ${result.rateLimitReset}`
          );
        } else if (result.error) {
          // Other error - use console.error but don't escalate to user
          console.error(`USDC top-up failed: ${result.error}`);
        }
      } else {
        console.log("BetButton login USDC top-up result:", result);
      }

      //Sleep for 2 seconds to ensure the balance is updated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      fetchUsdcBalance();
    },
  });
  // In Storybook/development, use mock data if real data isn't available

  // if (option.length > 24) {
  //   throw new Error("Option text cannot be longer than 24 characters");
  // }
  if (optionIndex < 0 || optionIndex >= MAX_OPTIONS) {
    throw new Error(`Invalid option index, can only be 0-${MAX_OPTIONS - 1}`);
  }

  // Log deprecation warning when disabled prop is used
  if (disabled !== undefined) {
    console.warn(
      "The 'disabled' prop in BetButton is deprecated and will be removed in a future version. " +
        "The button's disabled state is now handled internally based on loading state."
    );
  }

  // Calculate potential earnings
  const calculateEarnings = () => {
    if (
      !amount ||
      parseFloat(amount) === 0 ||
      !totalBetsByOption[optionIndex]
    ) {
      return 0;
    }

    const betAmountInUSDC = parseFloat(amount);
    const optionTotal = parseFloat(totalBetsByOption[optionIndex]);
    const totalPool = parseFloat(totalBets);

    // If there's no bets on the other side (i.e this option is 100% of the pool), you win your bet amount back
    if (optionTotal === totalPool) {
      return 0;
    }

    return (
      (betAmountInUSDC / (optionTotal + betAmountInUSDC)) *
        (totalPool + betAmountInUSDC) -
      betAmountInUSDC
    );
  };

  const potentialEarnings = calculateEarnings();

  /**
   * Removes trailing zeros from a hex string while ensuring it maintains a valid hex representation
   * with an even number of digits (required for proper hex encoding)
   * @param hexString - The hex string to process (e.g., "0x8000", "0x8300")
   * @returns The processed hex string (e.g., "0x80", "0x83")
   */
  const removeTrailingZeros = (hexString: string): string => {
    // If not a hex string or too short, return as is
    if (!hexString.startsWith("0x") || hexString.length <= 2) {
      return hexString;
    }

    // Remove "0x" prefix for processing
    let hex = hexString.slice(2);

    // Remove trailing zeros
    while (hex.length > 0 && hex.endsWith("0")) {
      hex = hex.slice(0, -1);
    }

    // If we've removed all digits, return "0x0"
    if (hex.length === 0) {
      return "0x0";
    }

    // Ensure even number of digits (required for valid hex encoding)
    if (hex.length % 2 !== 0) {
      hex = hex + "0";
    }

    // Add "0x" prefix back
    return "0x" + hex;
  };

  const handleClick = async () => {
    if (isLoading) return;
    if (!embeddedWallet || !authenticated) {
      console.log("No embedded wallet found, logging in");
      login();

      return;
    }

    try {
      setIsLoading(true);

      // Process poolId to remove trailing zeros while maintaining valid hex format
      const processedPoolId = removeTrailingZeros(poolId);
      console.log(
        "Original poolId:",
        poolId,
        "Processed poolId:",
        processedPoolId
      );

      // Use the placeBet function from our betting library
      const txResult = await placeBet(
        embeddedWallet,
        chainId,
        processedPoolId,
        optionIndex,
        amount,
        tokenType
      );
      console.log("txResult on placeBet", txResult);

      // Format the amount properly using the usdcAmountToDollars function
      const formattedAmount = usdcAmountToDollars(amount);

      // Determine if the prefix is a string or an image
      const prefix = chainConfig?.usdcPrefix;

      // If it's a simple string prefix, we can use a template string
      if (typeof prefix === "string") {
        const toastDescription = `Your bet of ${prefix}${formattedAmount} has been placed on "${option}"`;
        toast.success("Transaction submitted successfully!", {
          description: toastDescription,
          duration: 5000,
        });
      } else {
        // If it's an image, we need to use JSX
        toast.success("Transaction submitted successfully!", {
          description: (
            <div className="flex flex-wrap items-center">
              <span>Your bet of </span>
              {tokenLogo}
              <span className="mx-0.5">{formattedAmount}</span>
              <span> has been placed on &quot;{option}&quot;</span>
            </div>
          ),
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error processing bet:", error);
      toast.error(`Error placing bet`, {
        description: error instanceof Error ? error.message : String(error),
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={cn(
        "min-w-42 min-h-32 px-4 font-medium fond-bold rounded-xl",
        "flex flex-col items-center justify-center font-bold",
        "w-full h-full border-2 transition-colors duration-200",
        colorClassnames.border,
        colorClassnames.text,
        {
          "text-white": isLoading,
          "bg-gray-900/50": disabled,
          [`${colorClassnames.border}/30`]: disabled,
          [`${colorClassnames.text}/50`]: disabled,
        }
      )}
      disabled={isLoading}
      type="button"
      onClick={handleClick}
      aria-busy={isLoading}
      aria-label={`Place bet on ${option}`}
      style={
        {
          borderColor: `hsl(var(--${optionColor[optionIndex]}-color))`,
          backgroundColor: isLoading
            ? `hsl(var(--${optionColor[optionIndex]}-color))`
            : "transparent",
          color: isLoading ? "white" : undefined,
          WebkitAppearance: "none",
          MozAppearance: "textfield",
          "--hover-color": `hsl(var(--${optionColor[optionIndex]}-color) / 0.2)`,
        } as React.CSSProperties
      }
      // Use onMouseEnter and onMouseLeave for hover effects
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          (
            e.currentTarget as HTMLButtonElement
          ).style.backgroundColor = `hsl(var(--${optionColor[optionIndex]}-color) / 0.2)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
        }
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          <>
            <span
              className={`
                  text-center line-clamp-3 mb-1 w-full flex-grow flex items-center justify-center text-xl`}
            >
              {option}
            </span>
            <span className={`text-[8px] text-gray-500 w-full text-center`}>
              You could win
            </span>
            <span
              className={`text-lg font-medium w-full text-center flex items-center justify-center`}
            >
              <span className="flex items-center gap-1">
                {tokenLogo}
                {usdcAmountToDollars(potentialEarnings)}
              </span>
            </span>
          </>
        )}
      </div>
    </button>
  );
};
