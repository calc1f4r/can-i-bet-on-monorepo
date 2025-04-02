"use client";
import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import {
  PrivyLoginButton,
  PrivyLogoutButton,
} from "@/components/PrivyLoginButton";
import { useTokenContext } from "@/components/TokenContext";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUsdcBalance } from "@/components/useUsdcBalance";
import { TokenType } from "@/lib/__generated__/graphql";
import PromptbetLogo from "@/stories/assets/CanIBetOn Logo.jpg";
import { usePrivy } from "@privy-io/react-auth";
import { AlertCircle, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { baseSepolia } from "viem/chains";

export const defaultChainId = baseSepolia.id;

export const Navbar = () => {
  const { ready, authenticated } = usePrivy();

  // Use our context for wallet and chain info
  const { embeddedWallet, chainConfig } = useEmbeddedWallet();

  // Use the useUsdcBalance hook instead of implementing fetchUsdcBalance
  const { usdcBalance, error } = useUsdcBalance();

  // Use token context for switching between tokens
  const { tokenType, setTokenType, tokenSymbol, tokenLogo } = useTokenContext();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo with circle mask for mobile */}
            <div className="relative">
              <Image
                src={PromptbetLogo}
                alt="PromptBet Logo"
                width={32}
                height={32}
                className="rounded-full object-cover md:rounded-none"
              />
            </div>
            {/* Text only visible on desktop */}
            <span className="font-bold text-lg tracking-wide hidden md:inline">
              @CanIBetOn
            </span>
          </Link>
        </div>

        {/* Mobile Balance Display (outside hamburger menu) */}
        {ready && authenticated && embeddedWallet && (
          <div className="md:hidden flex items-center mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-col text-sm font-medium min-w-20 text-center border rounded-full relative">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="flex items-center justify-center gap-1">
                      {tokenLogo}
                      {parseFloat(usdcBalance || "0").toLocaleString()}
                    </div>
                    {error && (
                      <span className="absolute -right-2 -top-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {error && (
                  <TooltipContent>
                    <p>{error}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Token Switch - Always visible */}
          <div className="flex items-center gap-2">
            {tokenLogo}
            <Switch
              checked={tokenType === TokenType.Points}
              onCheckedChange={(value) => {
                setTokenType(value ? TokenType.Points : TokenType.Usdc);
              }}
              className="bg-gray-800"
            />
            <span>{tokenSymbol}</span>
          </div>

          {/* Balance and Auth - Only visible when authenticated */}
          {ready && authenticated && embeddedWallet && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-col text-sm font-medium min-w-24 text-center border rounded-full relative">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="flex items-center justify-center gap-1">
                      {tokenLogo}
                      {parseFloat(usdcBalance || "0").toLocaleString()}
                    </div>
                    {error && (
                      <span className="absolute -right-2 -top-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {error && (
                  <TooltipContent>
                    <p>{error}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
          {ready && authenticated ? (
            <PrivyLogoutButton />
          ) : (
            <PrivyLoginButton />
          )}
        </div>

        {/* Mobile Menu - Using Shadcn Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2" aria-label="Open menu">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-10">
              <SheetTitle className="text-left mb-4">Menu</SheetTitle>
              <div className="flex flex-col gap-4">
                {/* Token Switch in Mobile Menu - Always visible */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-md bg-gray-800">
                  {tokenLogo}
                  <Switch
                    checked={tokenType === TokenType.Points}
                    onCheckedChange={(value) => {
                      console.log("value", value);
                      console.log("current token type", tokenType);
                      console.log("Points token type", TokenType.Points);
                      console.log("USDC token type", TokenType.Usdc);
                      console.log(
                        "setting to",
                        value ? TokenType.Points : TokenType.Usdc
                      );
                      setTokenType(value ? TokenType.Points : TokenType.Usdc);
                    }}
                  />
                  <span>{tokenSymbol}</span>
                </div>
                <div className="mt-2">
                  {ready && authenticated ? (
                    <PrivyLogoutButton />
                  ) : (
                    <PrivyLoginButton />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
