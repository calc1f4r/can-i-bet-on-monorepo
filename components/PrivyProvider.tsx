"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { createConfig, http, WagmiProvider } from "wagmi";
import { EmbeddedWalletProvider } from "./EmbeddedWalletProvider";

// Create a Wagmi config - ensure we're importing createConfig from @privy-io/wagmi
const wagmiConfig = createConfig({
  chains: [baseSepolia], //Make sure this matches SupportedNetworks from common/consts
  transports: {
    //The first chain that appears below is the default chain
    [baseSepolia.id]: http(),
  },
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="cm7b6229i003ccgeozvxyjv2h"
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        // Customize Privy's appearance in your app
        // TODO Don't harcode theme
        appearance: {
          theme: "dark",
          accentColor: "#FFF",
          logo: "https://i.imgur.com/GeQsoyC.jpeg", //TODO Placeholder logo
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <EmbeddedWalletProvider>{children}</EmbeddedWalletProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
