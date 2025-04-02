import { TokenType } from "@/lib/__generated__/graphql";
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
  tokenType: TokenType;
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
    const { tokenType = TokenType.Usdc } = body; // Default to USDC if not specified

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

    // Create contract instance
    const contract = new ethers.Contract(
      chainConfig.appAddress,
      BettingPoolsAbi.abi,
      wallet
    );

    console.log("Contract address:", chainConfig.appAddress);
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
      tokenType: body.tokenType,
      permitDeadline: body.usdcPermitDeadline,
      permitSignature: permitSig,
    });

    // convert pool ID from hex to number

    console.log("Data to call TX:", {
      poolId: BigInt(body.poolId),
      optionIndex: body.optionIndex,
      amount: BigInt(body.amount),
      walletAddress: body.walletAddress,
      tokenType: body.tokenType,
      permitDeadline: body.usdcPermitDeadline,
      permitSignature: permitSig,
    });

    // Map TokenType enum from GraphQL to the contract's TokenType enum (0 for USDC, 1 for POINTS)
    const contractTokenType = tokenType === TokenType.Usdc ? 0 : 1;

    // Call placeBet
    const tx = await contract.placeBet(
      BigInt(body.poolId),
      body.optionIndex,
      BigInt(body.amount),
      body.walletAddress,
      contractTokenType, // Add tokenType parameter
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

    // Wait for the transaction to be mined with 1 confirmation
    try {
      const receipt = await tx.wait(1);

      // Check if transaction was successful
      if (receipt && receipt.status === 1) {
        return NextResponse.json({
          success: true,
          transactionHash: tx.hash,
          receipt: {
            blockNumber: receipt.blockNumber,
            blockHash: receipt.blockHash,
            status: receipt.status,
          },
        });
      } else {
        return NextResponse.json({
          success: false,
          transactionHash: tx.hash,
          error: "Transaction failed on-chain",
          receipt: {
            blockNumber: receipt?.blockNumber,
            blockHash: receipt?.blockHash,
            status: receipt?.status,
          },
        });
      }
    } catch (waitError) {
      // Transaction was reverted or failed
      console.error("Transaction failed:", waitError);
      return NextResponse.json({
        success: false,
        transactionHash: tx.hash,
        error: `Transaction reverted: ${
          waitError instanceof Error ? waitError.message : String(waitError)
        }`,
      });
    }
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
