"use client";

import { useNetwork } from "@/components/useNetwork";
import { TokenType } from "@/lib/__generated__/graphql";
import { CHAIN_CONFIG } from "@/lib/config";
import { USDC_DECIMALS } from "@/lib/utils";
import usdpLogo from "@/stories/assets/usdp-logo.svg";
import Image from "next/image";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Address } from "viem";
import { baseSepolia } from "viem/chains";

// Token logos/symbols
export const TOKEN_SYMBOLS: Record<
  TokenType,
  {
    symbol: string;
    logo: React.ReactNode;
    decimals: number;
  }
> = {
  [TokenType.Usdc]: {
    symbol: "USDC",
    logo: (
      <Image
        src="/usdc.svg"
        alt="USD"
        width={16}
        height={16}
        style={{ display: "inline" }}
      />
    ),
    decimals: 6, // Don't use USDC_DECIMALS, this "TOKEN_CONFIG" will eventually be our authority for token details
  },
  [TokenType.Points]: {
    symbol: "BET",
    logo: (
      <Image
        src={usdpLogo}
        alt="BET"
        width={16}
        height={16}
        style={{ display: "inline" }}
      />
    ),
    decimals: 6,
  },
};

interface TokenContextType {
  tokenType: TokenType;
  setTokenType: (type: TokenType) => void;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenLogo: React.ReactNode;
  tokenDecimals: number;
}

// Create context with default values
const TokenContext = createContext<TokenContextType>({
  tokenType: TokenType.Usdc,
  setTokenType: () => {},
  tokenAddress: CHAIN_CONFIG[baseSepolia.id].usdcAddress,
  tokenSymbol: TOKEN_SYMBOLS[TokenType.Usdc].symbol,
  tokenLogo: TOKEN_SYMBOLS[TokenType.Usdc].logo,
  tokenDecimals: USDC_DECIMALS,
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { usdcAddress, pointsAddress } = useNetwork();
  
  const [tokenType, setTokenType] = useState<TokenType>(TokenType.Usdc);

  const {
    symbol: tokenSymbol,
    logo: tokenLogo,
    decimals: tokenDecimals,
  } = TOKEN_SYMBOLS[tokenType];

  const tokenAddress =
    tokenType === TokenType.Usdc ? usdcAddress : pointsAddress;

  // Load saved preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trump-fun-token-type");
      if (saved !== null) {
        if (saved === TokenType.Usdc || saved === TokenType.Points) {
          setTokenType(saved as TokenType);
        }
      }
    }
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trump-fun-token-type", tokenType);
    }
  }, [tokenType]);

  const value: TokenContextType = {
    tokenType,
    setTokenType,
    tokenAddress,
    tokenSymbol,
    tokenLogo,
    tokenDecimals,
  };

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

// Hook for consuming the context
export const useTokenContext = () => useContext(TokenContext);
