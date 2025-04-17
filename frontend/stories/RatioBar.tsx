import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usdcAmountToDollars } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

interface RatioItem {
  label: string;
  amount: number;
  color: string;
  iconUrl?: string;
}

interface RatioBarProps {
  items: RatioItem[];
  noContentLabel?: string;
  className?: string;
}

export const RatioBar: FC<RatioBarProps> = ({
  items,
  noContentLabel = "No bets",
  className = "",
}) => {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const hasItems = items.length > 0;
  const hasValue = total > 0;

  const getPercentage = (amount: number) => {
    if (!hasValue) return 0;
    return (amount / total) * 100;
  };

  const formatPercentage = (amount: number) => {
    return `${getPercentage(amount).toFixed(1)}%`;
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`h-5 w-full rounded-full overflow-hidden relative ${
              !hasItems || !hasValue ? "bg-gray-600" : ""
            } ${className}`}
          >
            {!hasItems || !hasValue ? (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {noContentLabel}
              </div>
            ) : (
              <div className="flex h-full w-full">
                {items.map((item, index) => {
                  const percentage = getPercentage(item.amount);
                  return percentage > 0 ? (
                    <div
                      key={index}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                      className="h-full transition-all duration-300"
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-gray-800 border-gray-700 max-w-[90vw] sm:max-w-[320px]"
        >
          {!hasItems ? (
            <div className="text-sm text-gray-200">No values</div>
          ) : (
            <div className="space-y-2 w-full">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 w-full min-w-0"
                >
                  {item.iconUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={item.iconUrl}
                        alt={`${item.label} icon`}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  )}
                  <Badge
                    className="truncate max-w-[100px] sm:max-w-[120px] text-xs sm:text-sm"
                    style={{
                      backgroundColor: item.color,
                      color: "white",
                    }}
                  >
                    {item.label}
                  </Badge>
                  <span className="text-gray-200 whitespace-nowrap text-xs sm:text-sm ml-auto">
                    {formatPercentage(item.amount)}
                    <span className="hidden sm:inline">
                      {` (${usdcAmountToDollars(item.amount)})`}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
