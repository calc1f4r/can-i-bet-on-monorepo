"use client";

import { GET_BETS } from "@/app/queries";
import { useEmbeddedWallet } from "@/components/EmbeddedWalletProvider";
import { PrivyLoginButton } from "@/components/PrivyLoginButton";
import { useTokenContext } from "@/components/TokenContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsdcBalance } from "@/components/useUsdcBalance";
import {
  Bet_OrderBy,
  GetBetsQuery,
  OrderDirection,
} from "@/lib/__generated__/graphql";
import { ActivityLine } from "@/stories/ActivityLine";
import { PlayerAddressChip } from "@/stories/PlayerAddressChip";
import { useQuery } from "@apollo/client";
import { usePrivy } from "@privy-io/react-auth";
import { LogIn } from "lucide-react";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

// Function to generate a random color based on address
const generateBannerColor = (address: string): string => {
  // Use the first 6 characters of the address as a hex color
  const colorHex = address.slice(2, 8);
  // Create a slightly transparent version for the banner
  return `#${colorHex}40`; // 40 is for 25% opacity
};

export default function UserBetsPage() {
  const params = useParams();
  const { ready, authenticated } = usePrivy();
  const {
    embeddedWallet,
    chainConfig,
    isLoading: walletLoading,
  } = useEmbeddedWallet();
  const [userAddress, setUserAddress] = useState<string>("");
  const { usdcBalance } = useUsdcBalance();

  // Determine if we're looking at our own profile or someone else's
  useEffect(() => {
    const addressParam = params.address as string;
    console.log("Address param:", addressParam);
    console.log("Embedded wallet address:", embeddedWallet?.address);

    if (addressParam === "self" && embeddedWallet?.address) {
      setUserAddress(embeddedWallet.address);
    } else if (addressParam !== "self") {
      setUserAddress(addressParam);
    }
  }, [params.address, embeddedWallet?.address]);

  // Show login button if trying to access "self" page but not authenticated
  if (params.address === "self" && ready && !authenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <LogIn className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              You need to be logged in to view your betting history.
            </p>
            <PrivyLoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while wallet is loading or when we're waiting for the self address
  if (walletLoading || (params.address === "self" && !userAddress)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Loading user profile...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have an address param that's not "self" but no userAddress is set, set it directly
  if (params.address !== "self" && !userAddress) {
    setUserAddress(params.address as string);
  }

  // Generate banner color based on address
  const bannerColor = userAddress
    ? generateBannerColor(userAddress)
    : "#00000040";

  return (
    <div className="container mx-auto py-8">
      {/* Twitter-style banner that merges with the profile card */}
      <div className="relative mb-16">
        <div
          className="w-full h-32 rounded-t-lg"
          style={{ backgroundColor: bannerColor }}
        />

        <div className="absolute -bottom-16 w-full">
          <UserProfile
            address={userAddress}
            isSelf={params.address === "self"}
            tokenBalance={usdcBalance || "0"}
          />
        </div>
      </div>

      <div className="mt-20">
        <UserBets address={userAddress} />
      </div>
    </div>
  );
}

interface UserProfileProps {
  address: string;
  isSelf: boolean;
  tokenBalance: string;
}

const UserProfile: FC<UserProfileProps> = ({
  address,
  isSelf,
  tokenBalance,
}) => {
  const { tokenLogo } = useTokenContext();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlayerAddressChip
              address={address}
              showAvatar={true}
              variant="large"
            />
            {isSelf && (
              <span className="text-sm bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                You
              </span>
            )}
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Balance: </span>
            <span className="font-mono flex items-center">
              {tokenLogo}
              {parseFloat(tokenBalance || "0").toFixed(2)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

interface UserBetsProps {
  address: string;
}

const UserBets: FC<UserBetsProps> = ({ address }) => {
  if (!address) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betting History</CardTitle>
      </CardHeader>
      <CardContent>
        <UserBetsActivity address={address} />
      </CardContent>
    </Card>
  );
};

interface UserBetsActivityProps {
  address: string;
}

const UserBetsActivity: FC<UserBetsActivityProps> = ({ address }) => {
  const maxEntries = 10;
  const [poolBets, setPoolBets] = useState<GetBetsQuery["bets"]>([]);
  const [showAdditionalBets, setShowAdditionalBets] = useState(0);
  const [hasMoreBets, setHasMoreBets] = useState(true);

  // Create filter for the user's bets
  const filter = { user: address.toLowerCase() };

  console.log("Querying bets for address:", address);
  console.log("Filter:", filter);

  // Query for user's bets
  const {
    data: queryData,
    loading: isLoading,
    error,
    fetchMore,
  } = useQuery(GET_BETS, {
    variables: {
      first: maxEntries + showAdditionalBets,
      filter,
      orderBy: Bet_OrderBy.BlockTimestamp,
      orderDirection: OrderDirection.Desc,
    },
    pollInterval: 3000,
    skip: !address, // Skip the query if we don't have an address
  });

  // Update poolBets when query data changes
  useEffect(() => {
    if (queryData?.bets) {
      console.log("Received bets:", queryData.bets);
      setPoolBets(queryData.bets);

      // If we received fewer bets than requested, there are no more to load
      if (queryData.bets.length < maxEntries + showAdditionalBets) {
        setHasMoreBets(false);
      } else {
        setHasMoreBets(true);
      }
    }
  }, [queryData, maxEntries, showAdditionalBets]);

  const handleLoadMore = () => {
    const newShowAdditional = showAdditionalBets + 10;
    setShowAdditionalBets(newShowAdditional);

    fetchMore({
      variables: {
        first: maxEntries + newShowAdditional,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  if (error) {
    console.error("Error fetching bets:", error);
    return (
      <div className="text-center py-4 text-red-500">
        Error loading bets: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && poolBets.length === 0 && (
        <div className="text-center py-4">Loading activities...</div>
      )}
      {!isLoading && poolBets.length === 0 && (
        <div className="text-center py-4">No bets found</div>
      )}
      <div className="space-y-2">
        {poolBets.map((bet, index) => (
          <ActivityLine
            key={`${bet.id}-${index}`}
            bet={bet}
            showQuestion={true}
            showPoolImage={false}
          />
        ))}
      </div>

      {poolBets.length > 0 && hasMoreBets && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="w-full max-w-xs"
          >
            {isLoading ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};
