import { GET_BETS } from "@/app/queries";
import { useTokenContext } from "@/components/TokenContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bet_OrderBy,
  GetBetsQuery,
  OrderDirection,
} from "@/lib/__generated__/graphql";
import { useQuery } from "@apollo/client";
import { FC, useEffect, useMemo, useState } from "react";
import { ActivityLine } from "./ActivityLine";

// Query to fetch initial data
//TODO Try using fragments again, repeating common fields takes up space unnecessarily

export const Activity: FC<{
  maxEntries?: number;
  poolId?: string;
  showQuestion?: boolean;
  showPoolImage?: boolean;
}> = ({
  maxEntries = 10,
  poolId,
  showQuestion = true,
  showPoolImage = true,
}) => {
  const { tokenType } = useTokenContext();
  // State to store combined data from query and subscription
  const [poolBets, setPoolBets] = useState<GetBetsQuery["bets"]>([]);
  const [showAdditionalBets, setShowAdditionalBets] = useState(0);

  // Create filter based on poolId if provided
  const filter = useMemo(
    () =>
      poolId
        ? {
            pool: poolId,
            tokenType: tokenType,
          }
        : {
            tokenType: tokenType,
          },
    [poolId, tokenType]
  );

  // Query for initial data with polling for real-time updates
  const {
    data: queryData,
    loading: queryLoading,
    subscribeToMore,
  } = useQuery(GET_BETS, {
    variables: {
      first: maxEntries + showAdditionalBets,
      filter,
      orderBy: Bet_OrderBy.BlockTimestamp,
      orderDirection: OrderDirection.Desc,
    },
    pollInterval: 3000,
  });

  // Update poolBets when query data changes
  useEffect(() => {
    if (queryData?.bets) {
      setPoolBets(queryData.bets);
    }
  }, [queryData]);

  // Set up subscription for real-time updates
  useEffect(() => {
    // Subscribe to new bets
    const unsubscribe = subscribeToMore({
      document: GET_BETS,
      variables: {
        filter,
        orderBy: Bet_OrderBy.BlockTimestamp,
        orderDirection: OrderDirection.Desc,
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log("subscriptionData", subscriptionData);
        if (!subscriptionData.data) return prev;

        // Extract the new bet from the subscription data
        // The structure depends on your subscription response
        const newBet = subscriptionData.data.bets?.[0];

        if (!newBet) return prev;

        // Check if the bet already exists in our list to avoid duplicates
        const betExists = prev.bets?.some((bet) => bet.id === newBet.id);
        if (betExists) return prev;

        // Add the new bet at the beginning of the array (most recent first)
        return {
          ...prev,
          bets: [newBet, ...(prev?.bets || [])],
        };
      },
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, [subscribeToMore, filter]);

  // Determine loading state
  const isLoading = queryLoading && poolBets.length === 0;

  // TODO get count of all bets for the pool and then hide the show more button at the end
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={"text-center"}>Bet history</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading && (
            <div className="text-center py-4">Loading activities...</div>
          )}
          {!isLoading && poolBets.length === 0 && (
            <div className="text-center py-4">No bets found</div>
          )}
          {poolBets.map((activity, index) => (
            <ActivityLine
              key={`${activity.id}-${index}`}
              bet={activity}
              showQuestion={showQuestion}
              showPoolImage={showPoolImage}
            />
          ))}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAdditionalBets(showAdditionalBets + 5)}
            >
              Show more
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
