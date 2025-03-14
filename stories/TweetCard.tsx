"use client";

import { GET_POOL } from "@/app/queries";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { CreatorInfo } from "./CreatorInfo";
import { CurrentSpreadCard } from "./CurrentSpreadCard";
import Tweet from "./Tweet";

const TELEGRAM_TWEET_ID = "9999999999999999999999999999999999";

interface TweetCardProps {
  poolId: string;
  className?: string;
  showCountdown?: boolean;
  showCurrentSpread?: boolean;
}

const TweetCard = ({
  poolId,
  className = "",
  showCountdown = true,
  showCurrentSpread = false,
}: TweetCardProps) => {
  // Randomly select a tweet ID for now

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_POOL, {
    variables: { poolId },
  });

  //TODO Show a skeleton here, not loading
  if (loading) {
    return <div>Loading...</div>;
  }
  if (queryError) {
    return <div>Query Error: {queryError.message}</div>;
  }

  if (!data?.pool?.creatorId || !data?.pool?.creatorName) {
    return <div>No creator ID or name found for pool</div>;
  }

  return (
    <Card className={className}>
      <CardContent>
        <div className="flex-col justify-between gap-4 g mt-4">
          <div className={"flex flex-row gap-2 justify-center"}>
            <p>Pool started by:</p>
            <CreatorInfo
              creatorId={data?.pool?.creatorId}
              creatorName={data?.pool?.creatorName}
              className="justify-center"
            />
          </div>
          {!data?.pool?.xPostId ? (
            <div className="text-red-500 text-4xl text-center">
              No tweet ID found for pool
            </div>
          ) : (
            <Tweet id={data?.pool?.xPostId} />
          )}

          {showCurrentSpread && <CurrentSpreadCard poolId={poolId} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
