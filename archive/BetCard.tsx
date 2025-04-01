"use client";
import { useTokenContext } from "@/components/TokenContext";
import { Card, CardContent } from "@/components/ui/card";
import type { GetPoolsQuery } from "@/lib/__generated__/graphql";
import { optionColor } from "@/lib/config";
import {
  getTotalBetsForOption,
  getVolumeForTokenType,
  usdcAmountToDollars,
} from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import Jazzicon from "react-jazzicon";
import { VolumeWithIcon } from "../stories/IconsWithNumbers";
import { RatioBar } from "../stories/RatioBar";
export interface BetCardProps {
  pool: GetPoolsQuery["pools"][0]; //typeof single elem from GET_POOL
}

//TODO Implement placing an actual bet
const BetCard = ({ pool }: BetCardProps) => {
  console.log("pool", pool);
  const { tokenType } = useTokenContext();

  // Build ratio items for the RatioBar from the pool options and their totals
  const ratioItems = pool.options.map((option, index) => ({
    label: option,
    amount: Number(getTotalBetsForOption(pool, tokenType, index)),
    color: optionColor[index],
  }));

  // Convert the pool's selected option to a number
  return (
    <motion.div
      className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-emerald-500/30 w-full max-w-[420px]"
      initial={{
        background:
          "linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))",
      }}
      animate={{
        background:
          "linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))",
      }}
      whileHover={{
        background: [
          "linear-gradient(to right, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8))",
          "linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8), rgba(168, 85, 247, 0.8))",
          "linear-gradient(to right, rgba(16, 185, 129, 0.8), rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8))",
        ],
      }}
      transition={{
        background: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        },
      }}
    >
      <Card className="bg-background/95 backdrop-blur-sm rounded-lg overflow-hidden">
        <CardContent className="p-4 flex flex-col">
          {/* Header section with pool image, avatar, and text */}
          <div className="flex gap-3 mb-2">
            <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={pool.imageUrl}
                alt="Pool Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 flex-shrink-0">
                  <Jazzicon
                    diameter={20}
                    // Use a slice of the address for the seed calculation
                    seed={parseInt(pool.creatorId)}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground truncate">
                  {pool.creatorName}
                </span>
              </div>
              <h3 className="text-base font-semibold line-clamp-3 leading-tight">
                <Link href={`/pools/${pool.id}`} className="hover:underline">
                  {pool.question}
                </Link>
              </h3>
            </div>
          </div>

          {/* Ratio Bar showing distribution for options */}
          <div className="mb-4">
            <RatioBar items={ratioItems} />
          </div>

          {/* Options and totals section */}

          <div className="flex flex-col gap-2 mb-2">
            {pool.options.map((option, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className={`font-semibold text-${optionColor[index]}`}>
                  {option}
                </span>
                <span className="text-muted-foreground">
                  {usdcAmountToDollars(
                    getTotalBetsForOption(pool, tokenType, index)
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-auto">
            {/* Use getVolumeForTokenType to get the appropriate total */}
            <VolumeWithIcon number={getVolumeForTokenType(pool, tokenType)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BetCard;
