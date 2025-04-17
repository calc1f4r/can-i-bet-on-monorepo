import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import { cn, parseChainId } from "@/lib/utils";
import Image from "next/image";

interface NetworkButtonProps {
  chainId?: number | string;
  selected?: boolean;
  onClick?: () => void;
  size?: "default" | "small";
}

export function NetworkButton({
  chainId: propChainId,
  selected = false,
  onClick,
  size = "default",
}: NetworkButtonProps) {
  const { currentChainId, chainConfig: contextChainConfig } =
    useEmbeddedWallet();

  // Use provided chainId or fall back to the context chainId
  const chainId = propChainId || currentChainId;
  const parsedChainId = parseChainId(chainId);

  // Use the chain config from context if available, otherwise get it from the CHAIN_CONFIG
  const chainConfig =
    contextChainConfig ||
    (parsedChainId
      ? {
          backgroundColor: "#FFFFFF",
          iconUrl: "",
          chain: { name: "Unknown" },
        }
      : {
          backgroundColor: "#FFFFFF",
          iconUrl: "",
          chain: { name: "Unknown" },
        });

  if (!chainConfig) {
    return null;
  }

  // Determine if the button should be interactive
  const isInteractive = typeof onClick === "function";

  return (
    <div
      className={cn(
        "relative rounded-lg",
        size === "default" ? "p-1.5" : "p-0.5",
        selected && "border-[3px]"
      )}
      style={{ borderColor: chainConfig.backgroundColor }}
    >
      <div
        onClick={isInteractive ? onClick : undefined}
        style={{ backgroundColor: chainConfig.backgroundColor }}
        className={cn(
          "flex items-center justify-center rounded-lg transition-all",
          size === "default"
            ? "w-[12.5rem] h-[3.75rem]"
            : "w-[7.5rem] h-[2rem]",
          isInteractive
            ? "hover:opacity-80 active:opacity-70 cursor-pointer"
            : "cursor-default"
        )}
      >
        <div
          className={cn(
            "relative",
            size === "default" ? "w-[10rem] h-[2.5rem]" : "w-[6rem] h-[1.25rem]"
          )}
        >
          <Image
            src={chainConfig.iconUrl}
            alt={`${chainConfig.chain.name} Network`}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
