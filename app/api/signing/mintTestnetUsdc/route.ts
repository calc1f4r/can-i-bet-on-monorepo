import USDPAbi from "@/contracts/out/USDP.sol/USDP.json";
import { CHAIN_CONFIG } from "@/lib/config";
import { USDC_DECIMALS } from "@/lib/utils";
import { ethers } from "ethers";
import Redis from "ioredis";
import { NextResponse } from "next/server";
import { scroll, scrollSepolia } from "viem/chains";
export type TopUpUsdcBalanceParams = {
  chainId: string | number;
  walletAddress: string;
};

export type TopUpUsdcBalanceResponse = {
  success: boolean;
  transactionHash?: string;
  amountMinted: string;
  rateLimitReset?: string;
  error?: string;
  message?: string;
};

const PRIVATE_CHAIN_CONFIG: {
  [key: keyof typeof CHAIN_CONFIG]: { rpcUrl: string };
} = {
  [scrollSepolia.id]: {
    rpcUrl: process.env.SCROLL_SEPOLIA_RPC_URL || "", // Move to env variable
  },
  [scroll.id]: {
    rpcUrl: process.env.SCROLL_RPC_URL || "", // Move to env variable
  },
};

// Redis client setup
const getRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Check if user has received USDC in the last 12 hours
const checkRateLimit = async (
  walletAddress: string,
  chainId: string | number
): Promise<boolean> => {
  const redis = getRedisClient();
  try {
    const key = `usdc_mint:${chainId}:${walletAddress.toLowerCase()}`;
    const result = await redis.get(key);

    if (result) {
      return false; // Rate limited
    }

    return true; // Not rate limited
  } catch (error) {
    console.error("Redis error:", error);
    return true; // Allow the request if Redis fails
  } finally {
    redis.quit();
  }
};

// Set rate limit for 12 hours
const setRateLimit = async (
  walletAddress: string,
  chainId: string | number
): Promise<void> => {
  const redis = getRedisClient();
  try {
    const key = `usdc_mint:${chainId}:${walletAddress.toLowerCase()}`;
    const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;
    // const TWELVE_HOURS_IN_SECONDS = 12 * 60 * 60;

    await redis.set(key, "1", "EX", SIX_HOURS_IN_SECONDS);
  } catch (error) {
    console.error("Redis error when setting rate limit:", error);
  } finally {
    redis.quit();
  }
};

export async function POST(request: Request) {
  try {
    console.log("Received request:", request);
    const body: TopUpUsdcBalanceParams = await request.json();
    const chainConfig = CHAIN_CONFIG[body.chainId];
    if (!chainConfig) {
      return NextResponse.json<TopUpUsdcBalanceResponse>(
        {
          success: false,
          amountMinted: "0",
          error: "Invalid chainId, no public config",
        },
        { status: 400 }
      );
    }
    const privateConfig = PRIVATE_CHAIN_CONFIG[body.chainId];

    if (!privateConfig) {
      return NextResponse.json<TopUpUsdcBalanceResponse>(
        {
          success: false,
          amountMinted: "0",
          error: "Invalid chainId, no private rpc url",
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const isAllowed = await checkRateLimit(body.walletAddress, body.chainId);
    if (!isAllowed) {
      return NextResponse.json<TopUpUsdcBalanceResponse>(
        {
          success: false,
          amountMinted: "0",
          rateLimitReset: (
            Math.floor(Date.now() / 1000) +
            12 * 60 * 60
          ).toLocaleString(),
          error: "You can only request testnet USDC once every 12 hours",
        },
        { status: 429 }
      );
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(privateConfig.rpcUrl);
    const privateKey = process.env.MAIN_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Relayer private key not configured");
    }
    const wallet = new ethers.Wallet(privateKey, provider);

    const usdcContract = new ethers.Contract(
      chainConfig.usdcAddress,
      USDPAbi.abi,
      wallet
    );
    const balance = await usdcContract.balanceOf(body.walletAddress);
    const targetAmount = BigInt(1000) * BigInt(10) ** BigInt(USDC_DECIMALS);

    // If balance is less than target, add the difference, otherwise add 0
    const amountToAdd =
      balance < targetAmount ? targetAmount - balance : BigInt(0);

    console.log("Balance:", balance, "Amount to add:", amountToAdd);

    if (amountToAdd > 0) {
      console.log("Minting USDC to the user", body.walletAddress, amountToAdd);
      const tx = await usdcContract.mint(body.walletAddress, amountToAdd);
      console.log("Minted USDC to the user", body.walletAddress, amountToAdd);

      // Set rate limit after successful mint
      await setRateLimit(body.walletAddress, body.chainId);

      // Don't wait for confirmations, just get the response
      return NextResponse.json<TopUpUsdcBalanceResponse>({
        success: true,
        transactionHash: tx.hash,
        amountMinted: amountToAdd.toString(),
        rateLimitReset: (
          Math.floor(Date.now() / 1000) +
          12 * 60 * 60
        ).toLocaleString(),
      });
    } else {
      // No USDC needed, but still return a success response
      return NextResponse.json<TopUpUsdcBalanceResponse>({
        success: true,
        amountMinted: "0",
        message: "No additional USDC needed for logged in user",
      });
    }
  } catch (error) {
    console.error("Error in mintTestnetUsdc:", error);
    return NextResponse.json<TopUpUsdcBalanceResponse>(
      {
        success: false,
        amountMinted: "0",
        error: `Failed to mint testnet USDC: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
