"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { EmbeddedWalletProvider } from "./EmbeddedWalletProvider";

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
      <EmbeddedWalletProvider>{children}</EmbeddedWalletProvider>
    </PrivyProvider>
  );
}
