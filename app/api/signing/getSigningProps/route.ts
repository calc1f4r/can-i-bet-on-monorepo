import BetPointsAbi from "@/contracts/out/BetPoints.sol/BetPoints.json"; //SWAP TO CONTRACT TYPES
import { TokenType } from "@/lib/__generated__/graphql";
import { CHAIN_CONFIG } from "@/lib/config";
import { ethers, ZeroAddress } from "ethers";
import { NextResponse } from "next/server";
import { baseSepolia } from "viem/chains";

// Define the expected request type
type GenerateSigningPropsRequest = {
  chainId: string | number;
  poolId: string;
  optionIndex: number;
  amount: string;
  userWalletAddress: string;
  tokenType: TokenType;
};

const PRIVATE_CHAIN_CONFIG: {
  [key: keyof typeof CHAIN_CONFIG]: { rpcUrl: string };
} = {
  // Using the same config as in sendSignedPlaceBet
  [baseSepolia.id]: {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || "",
  },
};

export async function POST(request: Request) {
  try {
    const body: GenerateSigningPropsRequest = await request.json();
    const { tokenType = TokenType.Usdc } = body; // Default to USDC if not specified

    // Validate chain configuration
    const chainConfig = CHAIN_CONFIG[body.chainId];
    if (!chainConfig) {
      console.error("Invalid chainId, no public config");
      return NextResponse.json(
        { error: "Invalid chainId, no public config" },
        { status: 400 }
      );
    }

    // Get the token address based on token type
    const tokenAddress =
      tokenType === TokenType.Usdc
        ? chainConfig.usdcAddress
        : chainConfig.pointsAddress;

    if (
      tokenAddress === ZeroAddress ||
      chainConfig.appAddress === ZeroAddress
    ) {
      console.error(
        `Invalid chainId, no ${tokenType.toLowerCase()} and/or application contract address`
      );
      return NextResponse.json(
        {
          error: `Invalid chainId, no ${tokenType.toLowerCase()} and/or application contract address`,
        },
        { status: 400 }
      );
    }

    const privateConfig = PRIVATE_CHAIN_CONFIG[body.chainId];
    if (!privateConfig) {
      console.error("Invalid chainId, no private rpc url");
      return NextResponse.json(
        { error: "Invalid chainId, no private rpc url" },
        { status: 400 }
      );
    }

    // Setup provider and contracts
    const provider = new ethers.JsonRpcProvider(privateConfig.rpcUrl);
    const wallet = new ethers.Wallet(process.env.MAIN_PRIVATE_KEY!, provider);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      BetPointsAbi.abi,
      wallet
    );

    // await tokenContract.mint(body.userWalletAddress, body.amount);

    // Get token nonce for the user
    const nonce = await tokenContract.nonces(body.userWalletAddress);

    // Get PERMIT_TYPEHASH from token contract
    const PERMIT_TYPEHASH = await tokenContract.PERMIT_TYPEHASH();

    // Return the input parameters plus contract info and token details
    return NextResponse.json({
      ...body,
      applicationContractAddress: chainConfig.appAddress,
      tokenContractAddress: tokenAddress,
      tokenNonce: nonce.toString(),
      tokenPermitTypehash: PERMIT_TYPEHASH,
      rpcUrl: privateConfig.rpcUrl,
      tokenName: await tokenContract.name(),
      tokenType,
    });
  } catch (error) {
    console.error("Error in generateSigningProps:", error);
    return NextResponse.json(
      {
        error: `Failed to generate signing props: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
