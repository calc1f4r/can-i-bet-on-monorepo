import BetPointsAbi from "@/contracts/out/BetPoints.sol/BetPoints.json"; //SWAP TO CONTRACT TYPES
import { CHAIN_CONFIG } from "@/lib/config";
import { ethers, parseUnits } from "ethers";
import { NextResponse } from "next/server";
import { baseSepolia } from "viem/chains";

type PlaceBetRequest = {
  chainId: string | number;
  poolId: string;
  optionIndex: number;
  amount: string;
  walletAddress: string;
  permitSignature: {
    v: number;
    r: string;
    s: string;
  };
  usdcPermitDeadline: number;
};

import BettingPoolsAbi from "@/contracts/out/BettingPools.sol/BettingPools.json";

const PRIVATE_CHAIN_CONFIG: {
  [key: keyof typeof CHAIN_CONFIG]: { rpcUrl: string };
} = {
  [baseSepolia.id]: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "", // Move to env variable
  },
};

export async function POST(request: Request) {
  try {
    console.log("Received request:", request);
    const body: PlaceBetRequest = await request.json();
    const chainConfig = CHAIN_CONFIG[body.chainId];
    if (!chainConfig) {
      return NextResponse.json(
        { error: "Invalid chainId, no public config" },
        { status: 400 }
      );
    }
    const privateConfig = PRIVATE_CHAIN_CONFIG[body.chainId];

    if (!privateConfig) {
      return NextResponse.json(
        { error: "Invalid chainId, no private rpc url" },
        { status: 400 }
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
      BetPointsAbi.abi,
      wallet
    );

    // console.log("Mi6nting USDC to the user", body.walletAddress, body.amount);
    // await usdcContract.mint(body.walletAddress, BigInt(body.amount));
    // console.log("Minted USDC to the user", body.walletAddress, body.amount);

    // Create contract instance
    const contract = new ethers.Contract(
      chainConfig.applicationContractAddress,
      BettingPoolsAbi.abi,
      wallet
    );

    console.log("Contract address:", chainConfig.applicationContractAddress);
    console.log("Wallet address:", wallet.address);

    // Format permit signature
    const permitSig = {
      v: body.permitSignature.v,
      r: body.permitSignature.r,
      s: body.permitSignature.s,
    };

    console.log("Calling placeBet with the following data:", {
      poolId: body.poolId,
      optionIndex: body.optionIndex,
      amount: body.amount,
      walletAddress: body.walletAddress,
      permitDeadline: body.usdcPermitDeadline,
      permitSignature: permitSig,
    });

    // convert pool ID from hex to number
    const poolId = parseInt(body.poolId, 16);

    console.log("Data to call TX:", {
      poolId,
      optionIndex: body.optionIndex,
      amount: BigInt(body.amount),
      walletAddress: body.walletAddress,
      permitDeadline: body.usdcPermitDeadline,
      permitSignature: permitSig,
    });

    // Call placeBet
    const tx = await contract.placeBet(
      poolId,
      body.optionIndex,
      BigInt(body.amount),
      body.walletAddress,
      body.usdcPermitDeadline,
      permitSig,
      {
        gasLimit: 1000000,
        maxFeePerGas: parseUnits("5", "gwei"),
        maxPriorityFeePerGas: parseUnits("5", "gwei"),
        type: 2,
      }
    );

    console.log("Transaction sent:", tx.hash);

    // Don't wait for confirmations, just get the response
    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error("Error in sendSignedPlaceBet:", error);
    return NextResponse.json(
      {
        error: `Failed to place bet: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
