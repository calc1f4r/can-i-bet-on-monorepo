import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import { GetBetsQuery } from "@/lib/__generated__/graphql";
import { optionColor } from "@/lib/config";
import { renderUsdcPrefix } from "@/lib/usdcUtils";
import { USDC_DECIMALS } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FC, memo, useMemo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { PlayerAddressChip } from "./PlayerAddressChip";

export type ActivityLineProps = {
  bet: GetBetsQuery["bets"][0];
  showQuestion?: boolean;
  showPoolImage?: boolean;
  showSeparator?: boolean;
};

// Map option colors to actual Tailwind classes
const getOptionClasses = (colorKey: string) => {
  const colorMap: Record<string, { text: string; bg: string }> = {
    "option-a": { text: "text-blue-500", bg: "bg-blue-500/20" },
    "option-b": { text: "text-red-500", bg: "bg-red-500/20" },
    "option-c": { text: "text-green-500", bg: "bg-green-500/20" },
    "option-d": { text: "text-purple-500", bg: "bg-purple-500/20" },
    "option-e": { text: "text-yellow-500", bg: "bg-yellow-500/20" },
  };

  return colorMap[colorKey] || colorMap["option-a"];
};

const ActivityLineComponent: FC<ActivityLineProps> = ({
  bet,
  showQuestion = true,
  showPoolImage = true,
  showSeparator = true,
}) => {
  const { chainConfig } = useEmbeddedWallet();
  const poolSlug = bet.pool.id.toString();
  const timestamp = new Date(Number(bet.blockTimestamp) * 1000);
  const optionIdx = Number(bet.optionIndex);

  // Format bet amount as requested - human readable with commas and no cents
  const betAmountInUSDC = Number(bet.amount) / Math.pow(10, USDC_DECIMALS);
  // Use compact notation for small screens
  const formattedBetAmount = Math.round(betAmountInUSDC).toLocaleString();
  const compactBetAmount =
    Math.round(betAmountInUSDC) >= 1000
      ? `${(Math.round(betAmountInUSDC) / 1000).toFixed(1)}k`
      : Math.round(betAmountInUSDC).toString();

  const optionClasses = useMemo(() => {
    const colorKey = optionColor[optionIdx] || "option-a";
    return getOptionClasses(colorKey);
  }, [optionIdx]);

  // Format timestamp for compact display
  const formatCompactTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / (60 * 24))}d`;
  };

  return (
    <div
      className={
        showSeparator
          ? "border-b border-gray-800 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
          : ""
      }
    >
      <div className="flex gap-2 sm:gap-3 items-center">
        {showPoolImage && (
          <div className="flex-shrink-0">
            <Link href={`/pools/${poolSlug}`} className="block">
              <img
                src={bet.pool.imageUrl}
                alt={bet.pool.question.slice(0, 10)}
                width={32}
                height={32}
                className="rounded-full object-cover w-8 h-8 sm:w-12 sm:h-12"
              />
            </Link>
          </div>
        )}

        <div className="flex-grow min-w-0">
          {showQuestion && (
            <Link href={`/pools/${poolSlug}`} className="block">
              <div className="text-sm sm:text-base font-bold text-foreground mb-1 hover:underline">
                {bet.pool.question}
              </div>
            </Link>
          )}

          <div
            className={`flex items-center flex-nowrap sm:flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-2 ${
              !showQuestion ? "py-1" : ""
            }`}
          >
            <div className="flex items-center gap-1 flex-shrink-0 after:content-['·'] after:mx-1 after:text-gray-600">
              <div className="sm:hidden flex items-center">
                <Jazzicon
                  diameter={14}
                  seed={jsNumberForAddress(String(bet.userAddress))}
                />
              </div>
              <span className="hidden sm:inline">
                <Jazzicon
                  diameter={18}
                  seed={jsNumberForAddress(String(bet.userAddress))}
                />
              </span>
              <Link href={`/users/${bet.userAddress}`}>
                <PlayerAddressChip
                  address={bet.userAddress}
                  showAvatar={false}
                  variant="xs"
                  className="sm:hidden hover:underline"
                />
                <PlayerAddressChip
                  address={bet.userAddress}
                  showAvatar={false}
                  variant="small"
                  className="hidden sm:inline hover:underline"
                />
              </Link>
            </div>
            <div className="flex items-center after:content-['·'] after:mx-1 after:text-gray-600">
              <span className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 flex items-center">
                <span className="sm:hidden inline-flex items-center">
                  bet{" "}
                  <span className="flex items-center gap-1 mx-1">
                    {renderUsdcPrefix(chainConfig)}
                    {compactBetAmount}
                  </span>{" "}
                  on
                </span>
                <span className="hidden sm:inline-flex items-center">
                  bet{" "}
                  <span className="flex items-center gap-1 mx-1">
                    {renderUsdcPrefix(chainConfig)}
                    {formattedBetAmount}
                  </span>{" "}
                  on
                </span>
              </span>
            </div>
            <div className="min-w-0 flex-grow sm:flex-grow-0 flex items-center">
              <span
                className={`${optionClasses.text} ${optionClasses.bg} rounded px-1.5 sm:px-2 py-0.5 text-xs sm:text-sm truncate inline-block max-w-full`}
                title={bet.pool.options[optionIdx]}
              >
                {bet.pool.options[optionIdx]}
              </span>
            </div>

            <span className="text-xs ml-auto text-gray-500 sm:hidden whitespace-nowrap flex-shrink-0 flex items-center before:content-['·'] before:mr-1 before:text-gray-600">
              {formatCompactTime(timestamp)}
            </span>
          </div>
        </div>

        <div className="hidden sm:block flex-shrink-0 text-sm text-gray-500 self-center before:content-['·'] before:mr-2 before:text-gray-600">
          {formatDistanceToNow(timestamp, {
            addSuffix: false,
          })
            .replace("about ", "")
            .replace(" minutes", "m")}
        </div>
      </div>
    </div>
  );
};

export const ActivityLine = memo(ActivityLineComponent);
