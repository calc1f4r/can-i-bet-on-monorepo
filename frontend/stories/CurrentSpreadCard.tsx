import { GET_POOL } from "@/app/queries";
import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import { useTokenContext } from "@/components/TokenContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GetPoolQuery } from "@/lib/__generated__/graphql";
import { optionColor, optionColorClasses } from "@/lib/config";
import {
  FrontendPoolStatus,
  getFrontendPoolStatus,
  getTotalBetsForOption,
  getVolumeForTokenType,
  usdcAmountToDollars,
} from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { FC } from "react";
import { RatioBar } from "./RatioBar";


interface CurrentSpreadCardProps {
  poolId?: string;
  pool?: GetPoolQuery["pool"];
  loading?: boolean;
  showTitle?: boolean;
  cardClassName?: string;
  showTotalBets?: boolean;
}

const LoadingSkeleton = () => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <Skeleton className="h-8 w-40" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </CardContent>
  </Card>
);

export const CurrentSpreadCard: FC<CurrentSpreadCardProps> = ({
  poolId,
  pool: propPool,
  loading: propLoading,
  showTitle = true,
  cardClassName = "w-full max-w-md mx-auto",
  showTotalBets = true,
}) => {
  const { tokenType, tokenLogo } = useTokenContext();
  const { chainConfig } = useEmbeddedWallet();
  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(GET_POOL, {
    variables: { poolId: poolId || "" },
    fetchPolicy: "no-cache",
    skip: !poolId || !!propPool,
  });

  // Use either the provided pool or the one from the query
  const pool = propPool || data?.pool;
  const loading = propLoading || queryLoading;

  if (loading) return <LoadingSkeleton />;
  if (error || !pool) {
    return (
      <Card className={cardClassName}>
        <CardContent className="py-4">
          <div className="text-red-500">
            Error loading spread data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const ratioItems = [
    {
      label: pool.options[0] || "Oh, yes",
      amount: Number(getTotalBetsForOption(pool, tokenType, 0)) || 0,
      color: "hsl(var(--option-a-color))",
    },
    {
      label: pool.options[1] || "Oh, No",
      amount: Number(getTotalBetsForOption(pool, tokenType, 1)) || 0,
      color: "hsl(var(--option-b-color))",
    },
  ];

  const frontendPoolStatus = getFrontendPoolStatus(
    pool.status,
    pool.betsCloseAt
  );
  const totalBets = getVolumeForTokenType(pool, tokenType);
  return (
    <Card className={cardClassName}>
      {showTitle && (
        <CardHeader>
          <CardTitle className={"text-center"}>Current Spread</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-2 space-y-3">
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: showTitle ? "0px" : "10px",
          }}
        >
          <RatioBar items={ratioItems} className="mb-1" />
        </div>

        <div className="flex-col gap-4">
          {pool.options.map((option: string, index: number) => {
            const colorClassnames = optionColorClasses[index];
            const isWinner =
              frontendPoolStatus === FrontendPoolStatus.Graded &&
              parseInt(pool.selectedOption) === index;

            return (
              <div key={index} className="flex">
                <div
                  className={`text-lg font-bold mb-2 ${colorClassnames.text}`}
                  style={{
                    backgroundColor: isWinner
                      ? `hsl(var(--${optionColor[index]}-color) / 0.2)`
                      : "transparent",
                    borderColor: isWinner
                      ? `hsl(var(--${optionColor[index]}-color))`
                      : "transparent",
                    borderBottom: isWinner
                      ? `2px solid hsl(var(--${optionColor[index]}-color))`
                      : "0",
                  }}
                >
                  {option}
                </div>
                <div className="text-lg font-semibold ml-auto flex items-center gap-1">
                  {tokenLogo}
                  {usdcAmountToDollars(
                    getTotalBetsForOption(pool, tokenType, index) || 0
                  )}
                </div>
              </div>
            );
          })}

          {showTotalBets && (
            <>
              <Separator className="my-2 bg-gray-700 h-px" />
              <div className="flex mt-2">
                <div className="text-lg text-white font-bold">Total bets</div>
                <div className="text-lg text-white font-semibold ml-auto flex items-center gap-1">
                  {tokenLogo}
                  {usdcAmountToDollars(totalBets || 0)}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
