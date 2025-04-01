"use client";

import { GET_BETS } from "@/app/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bet_Filter,
  Bet_OrderBy,
  BetPlaced_OrderBy,
  OrderDirection,
} from "@/lib/__generated__/graphql";
import { usdcAmountToDollars } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { PlayerAddressChip } from "./PlayerAddressChip";
import { useTokenContext } from "@/components/TokenContext";

// Add new types for sorting

// Add variant type
type BetListVariant = "home" | "poolDrilldown";

export const BetList = ({
  poolId,
  userId,
  variant = "home", // Add default variant
}: {
  poolId?: string;
  userId?: string;
  loading?: boolean;
  variant?: BetListVariant;
}) => {
  const { tokenType } = useTokenContext();
  const filter: Bet_Filter = {
    tokenType: tokenType,
  };
  if (poolId) {
    filter.pool = poolId;
  }
  if (userId) {
    filter.userAddress = userId;
  }

  const [sortField, setSortField] = useState<BetPlaced_OrderBy>(
    BetPlaced_OrderBy.BlockTimestamp
  );
  const [sortDirection, setSortDirection] = useState<OrderDirection>(
    OrderDirection.Desc
  );

  console.log("filter", filter);

  const { data, loading } = useQuery(GET_BETS, {
    variables: {
      filter: filter,
      orderBy: Bet_OrderBy.BlockTimestamp,
      orderDirection: OrderDirection.Desc,
    },
  });

  const handleSort = (field: BetPlaced_OrderBy) => {
    if (field === sortField) {
      // Toggle direction if clicking same field
      setSortDirection(
        sortDirection === OrderDirection.Asc
          ? OrderDirection.Desc
          : OrderDirection.Asc
      );
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection(OrderDirection.Desc);
    }
  };

  const LoadingSkeleton = () => (
    <Card className="md:p-2">
      <CardHeader className="md:p-6 p-3 pb-0">
        {/* Sort Controls Skeleton */}
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="md:hidden">
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent className="md:p-6 p-3">
        {/* Desktop Skeleton - hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-6 text-left">Date Created</th>
                <th className="py-3 px-6 text-left">Question</th>
                <th className="py-3 px-6 text-left">Outcome</th>
                <th className="py-3 px-6 text-left">Selected Option</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-8 w-20" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton - shown only on mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-24 mb-2" /> {/* Date */}
                  <Skeleton className="h-4 w-full mb-2" /> {/* Question */}
                  <div className="flex items-center gap-3 mt-2">
                    <Skeleton className="h-4 w-16" /> {/* Amount */}
                    <Skeleton className="h-4 w-16" /> {/* Outcome */}
                    <Skeleton className="h-4 w-16" /> {/* Transaction link */}
                  </div>
                </div>
                <Skeleton className="h-6 w-16" /> {/* Selected option */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Update desktop table columns based on variant
  const getTableHeaders = () => {
    if (variant === "home") {
      return (
        <tr>
          <th className="py-3 px-6 text-center">Date Created</th>
          <th className="py-3 px-6 text-center">Question</th>
          <th className="py-3 px-6 text-center">Option</th>
          <th className="py-3 px-6 text-center">Amount</th>
          <th className="py-3 px-6 text-center">Transaction</th>
        </tr>
      );
    }
    return (
      <tr>
        <th className="py-3 px-6 text-center">Date Created</th>
        <th className="py-3 px-6 text-center">User</th>
        <th className="py-3 px-6 text-center">Option</th>
        <th className="py-3 px-6 text-center">Amount</th>
        <th className="py-3 px-6 text-center">Links</th>
      </tr>
    );
  };

  return (
    <Card className="md:p-2">
      <CardHeader className="md:p-6 p-3 pb-0">
        <CardTitle className="mb-4">Betting History</CardTitle>
        {/* Sort Controls - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Button
            variant={
              sortField === BetPlaced_OrderBy.BlockTimestamp
                ? "default"
                : "outline"
            }
            onClick={() => handleSort(BetPlaced_OrderBy.BlockTimestamp)}
            className="gap-1"
          >
            {sortField === BetPlaced_OrderBy.BlockTimestamp &&
              (sortDirection === OrderDirection.Asc ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              ))}
            Date Placed
          </Button>
          <Button
            variant={
              sortField === BetPlaced_OrderBy.Amount ? "default" : "outline"
            }
            onClick={() => handleSort(BetPlaced_OrderBy.Amount)}
            className="gap-1"
          >
            {sortField === BetPlaced_OrderBy.Amount &&
              (sortDirection === OrderDirection.Asc ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              ))}
            Amount
          </Button>
        </div>

        {/* Sort Controls - Mobile */}
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort & Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-[calc(100vw-2rem)] mx-3">
              <div className="space-y-2">
                <div className="text-sm font-medium mb-3">Sort by:</div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={
                      sortField === BetPlaced_OrderBy.BlockTimestamp
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleSort(BetPlaced_OrderBy.BlockTimestamp)}
                    className="justify-between"
                  >
                    Date Placed
                    {sortField === BetPlaced_OrderBy.BlockTimestamp &&
                      (sortDirection === OrderDirection.Asc ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </Button>
                  <Button
                    variant={
                      sortField === BetPlaced_OrderBy.Amount
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleSort(BetPlaced_OrderBy.Amount)}
                    className="justify-between"
                  >
                    Amount
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="md:p-6 p-3">
        {/* Desktop view - hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800">{getTableHeaders()}</thead>
            <tbody>
              {data?.bets.map((bet) => {
                const dateCreated = new Date(
                  parseInt(bet.blockTimestamp) * 1000
                );
                const selectedOption =
                  bet.pool.options[parseInt(bet.optionIndex)];

                return (
                  <tr key={bet.id} className="border-b border-gray-200">
                    <td className="py-4 px-6 text-center">
                      {format(dateCreated, "PP")}
                    </td>
                    {variant === "home" ? (
                      <td className="py-4 px-6 text-center">
                        {bet.pool.question}
                      </td>
                    ) : (
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <PlayerAddressChip
                            address={bet.userAddress}
                            variant="small"
                            showAvatar={false}
                          />
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-full ${
                          selectedOption?.toUpperCase() === "YES"
                            ? "text-option-a bg-option-a/30"
                            : "text-option-b bg-option-b/30"
                        }`}
                      >
                        {selectedOption}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {usdcAmountToDollars(bet.amount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <a
                          href={`https://basescan.org/tx/${bet.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            Basescan
                          </div>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile view - update to match variant */}
        <div className="md:hidden divide-y divide-gray-100 -mt-2">
          {data?.bets.map((bet) => {
            const dateCreated = new Date(parseInt(bet.blockTimestamp) * 1000);
            const selectedOption = bet.pool.options[parseInt(bet.optionIndex)];

            return (
              <div key={bet.id} className="py-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500">
                      {format(dateCreated, "PP")}
                    </div>
                    {variant === "home" && (
                      <div className="text-sm mt-0.5 line-clamp-2">
                        {bet.pool.question}
                      </div>
                    )}
                    {variant === "poolDrilldown" && (
                      <div className="text-sm mt-0.5">
                        {/* <PlayerAddressChip
                          address={bet.userAddress}
                          variant="default"
                          showAvatar={false}
                        /> */}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-gray-500">
                        {usdcAmountToDollars(bet.amount)}
                      </span>
                      <a
                        href={`https://basescan.org/tx/${bet.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Basescan</span>
                      </a>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      selectedOption?.toUpperCase() === "YES"
                        ? "text-green-500 bg-green-500/20"
                        : "text-red-500 bg-red-500/20"
                    }`}
                  >
                    {selectedOption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
