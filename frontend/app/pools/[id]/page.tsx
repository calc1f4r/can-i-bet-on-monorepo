"use client";

import { GET_POOL } from "@/app/queries";
import { Button } from "@/components/ui/button";
import { Activity } from "@/stories/Activity";
import { CurrentSpreadCard } from "@/stories/CurrentSpreadCard";
import { PlaceBetCard } from "@/stories/PlaceBetCard";
import TweetCard from "@/stories/TweetCard";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

// See BetList.tsx for the fragment, ass backwards

type Params = Promise<{ id: string }>;

export default function PoolDetailsPage({ params }: { params: Params }) {
  const { id } = use(params);

  const { data: pool, loading: poolLoading } = useQuery(GET_POOL, {
    variables: {
      poolId: id,
    },
    pollInterval: 5000,
  });

  if (poolLoading) {
    return <div>Loading...</div>;
  }

  console.log("pool", pool);

  return (
    <div className="mx-auto flex flex-col">
      <div className="mt-4 ml-4">
        <Link href="/" className="w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-5 flex items-center gap-1 text-sm font-medium hover:bg-secondary leading-none"
          >
            <ArrowLeft size={16} className="relative -top-[1px]" />
            <span className="relative -top-[1px]">Back</span>
          </Button>
        </Link>
      </div>

      {pool?.pool ? (
        <div className="py-4 flex flex-col gap-4">
          <PlaceBetCard pool={pool?.pool} loading={poolLoading} />
          <CurrentSpreadCard pool={pool?.pool} loading={poolLoading} />
          <Activity
            poolId={id}
            showQuestion={false}
            showPoolImage={false}
            maxEntries={5}
          />
          <TweetCard poolId={id} className="w-full max-w-md mx-auto" />
        </div>
      ) : (
        <div className="text-red-500 text-center font-medium">
          Pool not found
        </div>
      )}
    </div>
  );
}
