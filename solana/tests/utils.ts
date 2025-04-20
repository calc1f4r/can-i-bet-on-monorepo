import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import * as token from '@solana/spl-token';

import { BettingPools2 } from '../target/types/betting_pools_2';

// MediaType helpers for Anchor's enum representation
export const MediaType = {
  X: { x: {} },
  TikTok: { tikTok: {} },
  Instagram: { instagram: {} },
  Facebook: { facebook: {} },
  Image: { image: {} },
  Video: { video: {} },
  ExternalLink: { externalLink: {} },
} as const;

// Constants
export const BETTING_POOLS_SEED = Buffer.from('betting_pools_v7');
export const POOL_SEED = Buffer.from('pool_v3');
export const BET_SEED = Buffer.from('bet_v1');
export const TOKEN_DECIMALS = 6;

// Convert a token amount to lamports (internal representation)
export function tokensToLamports(tokens: number): number {
  return tokens * Math.pow(10, TOKEN_DECIMALS);
}

// Convert lamports to tokens (for display)
export function lamportsToTokens(lamports: number): number {
  return lamports / Math.pow(10, TOKEN_DECIMALS);
}

// Utility function to create a betting pool
export async function createBettingPool(
  program: Program<BettingPools2>,
  bettingPoolsAddress: anchor.web3.PublicKey,
  authority: anchor.web3.PublicKey,
  params: {
    question: string;
    options: string[];
    betsCloseAt?: anchor.BN;
    mediaUrl?: string;
    mediaType?: (typeof MediaType)[keyof typeof MediaType];
    category?: string;
    creatorName?: string;
    creatorId?: string;
    closureCriteria?: string;
    closureInstructions?: string;
  }
): Promise<{
  poolAddress: anchor.web3.PublicKey;
  poolId: anchor.BN;
  tx: string;
}> {
  // Get the current state to get the next pool ID
  const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
  const poolId = bettingPoolsState.nextPoolId;

  // Get the next pool address
  const poolAddress = await getNextPoolAddress(program, bettingPoolsAddress);

  // Default values
  const betsCloseAt = params.betsCloseAt || new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
  const mediaUrl = params.mediaUrl || 'https://example.com/image.jpg';
  const mediaType = params.mediaType !== undefined ? params.mediaType : MediaType.Image; // Default to Image
  const category = params.category || 'Crypto';
  const creatorName = params.creatorName || 'Test Creator';
  const creatorId = params.creatorId || 'test123';
  const closureCriteria = params.closureCriteria || 'Default closure criteria';
  const closureInstructions = params.closureInstructions || 'Default instructions';

  // Create the pool
  const tx = await program.methods
    .createPool(
      params.question,
      params.options,
      betsCloseAt,
      mediaUrl,
      mediaType,
      category,
      creatorName,
      creatorId,
      closureCriteria,
      closureInstructions
    )
    .accounts({
      bettingPools: bettingPoolsAddress,
      pool: poolAddress,
      authority: authority,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  return { poolAddress, poolId, tx };
}

// Helper function to get the next pool address
export async function getNextPoolAddress(
  program: Program<BettingPools2>,
  bettingPoolsAddress: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  // Get the current state to get the next pool ID
  const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
  const poolId = bettingPoolsState.nextPoolId;

  // Calculate the pool address
  // Important: Match the exact seeds from the Rust program
  const [poolAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [POOL_SEED, poolId.toBuffer('le', 8)],
    program.programId
  );

  return poolAddress;
}

// Helper function to create a user with funded bet points
export async function createFundedUser(
  connection: anchor.web3.Connection,
  payer: anchor.web3.Keypair,
  betPointsMint: anchor.web3.PublicKey,
  betPointsAmount: number // Amount in tokens (will be converted to lamports)
): Promise<{
  user: anchor.web3.Keypair;
  betPointsAccount: anchor.web3.PublicKey;
  initialSolBalance: number;
}> {
  // Convert tokens to lamports
  const betPointsLamports = tokensToLamports(betPointsAmount);

  // Create a new keypair for the user
  const user = anchor.web3.Keypair.generate();

  // Fund the user with SOL
  const solAmount = 0.11 * anchor.web3.LAMPORTS_PER_SOL;

  // Transfer SOL from the payer/authority account to the user
  const transferIx = anchor.web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: user.publicKey,
    lamports: solAmount,
  });

  const tx = new anchor.web3.Transaction().add(transferIx);
  const latestBlockhash = await connection.getLatestBlockhash();
  tx.recentBlockhash = latestBlockhash.blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);
  const sig = await connection.sendRawTransaction(tx.serialize());
  await connection.confirmTransaction({
    signature: sig,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  console.log(
    `Transferred ${solAmount / anchor.web3.LAMPORTS_PER_SOL} SOL from authority to user ${user.publicKey.toString()}`
  );

  // Get the associated token account address for this user
  const associatedTokenAddress = await getAssociatedTokenAddress(betPointsMint, user.publicKey);

  // Create the token account for the user
  try {
    const createAccountIx = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      associatedTokenAddress,
      user.publicKey,
      betPointsMint
    );

    const tx = new anchor.web3.Transaction().add(createAccountIx);
    const latestBlockhash = await connection.getLatestBlockhash();
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = payer.publicKey;
    tx.sign(payer);
    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({
      signature: sig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });
    console.log(`Created token account for user: ${associatedTokenAddress.toString()}`);
  } catch (e) {
    console.log('Token account may already exist:', e);
  }

  // Mint BetPoints to the user
  try {
    const mintIx = createMintToInstruction(
      betPointsMint,
      associatedTokenAddress,
      payer.publicKey,
      betPointsLamports
    );

    const tx = new anchor.web3.Transaction().add(mintIx);
    const latestBlockhash = await connection.getLatestBlockhash();
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = payer.publicKey;
    tx.sign(payer);
    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({
      signature: sig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });
    console.log(`Minted ${betPointsAmount} BetPoints to user`);

    // Verify the balance
    const accountInfo = await getAccount(connection, associatedTokenAddress);
    console.log(`Token account balance verified: ${accountInfo.amount.toString()}`);
  } catch (e) {
    console.error('Error minting tokens:', e);
    throw e;
  }

  // Store the initial SOL balance to know how much was transferred
  const userSolBalance = await connection.getBalance(user.publicKey);

  return {
    user,
    betPointsAccount: associatedTokenAddress,
    initialSolBalance: userSolBalance,
  };
}

// Utility function to place a bet
export async function placeBet(
  program: Program<BettingPools2>,
  connection: anchor.web3.Connection,
  bettingPoolsAddress: anchor.web3.PublicKey,
  poolAddress: anchor.web3.PublicKey,
  poolId: anchor.BN,
  bettor: anchor.web3.Keypair,
  bettorTokenAccount: anchor.web3.PublicKey,
  programTokenAccount: anchor.web3.PublicKey,
  optionIndex: number,
  tokenAmount: number, // Amount in whole tokens (will be converted to lamports)
  betId: anchor.BN
): Promise<{
  betAddress: anchor.web3.PublicKey;
  transactionSignature: string;
  betAccount: any;
}> {
  // Convert tokens to lamports
  const lamports = tokensToLamports(tokenAmount);
  const amount = new anchor.BN(lamports);

  // Token type is always points for these tests
  const tokenType = { points: {} };

  // Find the bet account PDA
  const [betAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [BET_SEED, poolId.toBuffer('le', 8), betId.toBuffer('le', 8)],
    program.programId
  );

  // Execute the placeBet instruction
  const betTx = await program.methods
    .placeBet(new anchor.BN(optionIndex), amount, tokenType)
    .accounts({
      bettingPools: bettingPoolsAddress,
      pool: poolAddress,
      bet: betAddress,
      bettor: bettor.publicKey,
      bettorTokenAccount: bettorTokenAccount,
      programTokenAccount: programTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([bettor])
    .rpc();

  // Verify the bet account data
  const betAccount = await program.account.bet.fetch(betAddress);

  return {
    betAddress,
    transactionSignature: betTx,
    betAccount,
  };
}

// Utility function to return unused tokens and SOL back to authority
export async function returnUnusedAssets(
  connection: anchor.web3.Connection,
  users: Array<{
    user: anchor.web3.Keypair;
    betPointsAccount: anchor.web3.PublicKey;
    initialSolBalance: number;
  }>,
  betPointsMint: anchor.web3.PublicKey,
  authority: anchor.web3.PublicKey
): Promise<void> {
  console.log('\nCleaning up: Returning unused assets to authority...');

  for (let i = 0; i < users.length; i++) {
    const { user, betPointsAccount, initialSolBalance } = users[i];

    try {
      // 1. Return any remaining tokens
      try {
        const tokenAccountInfo = await getAccount(connection, betPointsAccount);
        const remainingTokens = Number(tokenAccountInfo.amount);

        if (remainingTokens > 0) {
          // Create transfer instruction for remaining tokens
          const authorityATA = await getAssociatedTokenAddress(betPointsMint, authority);

          // Create the transaction
          const transferIx = token.createTransferInstruction(
            betPointsAccount,
            authorityATA,
            user.publicKey,
            remainingTokens
          );

          const tx = new anchor.web3.Transaction().add(transferIx);
          const latestBlockhash = await connection.getLatestBlockhash();
          tx.recentBlockhash = latestBlockhash.blockhash;
          tx.feePayer = user.publicKey;
          tx.sign(user);

          const sig = await connection.sendRawTransaction(tx.serialize());
          await connection.confirmTransaction({
            signature: sig,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          });

          console.log(
            `User ${i + 1}: Returned ${lamportsToTokens(remainingTokens)} tokens to authority`
          );
        }
      } catch (e) {
        console.log(`Failed to return tokens for user ${i + 1}:`, e);
      }

      // 2. Return any remaining SOL (keeping some for tx fees)
      try {
        const currentBalance = await connection.getBalance(user.publicKey);
        const keepAmount = 0.01 * anchor.web3.LAMPORTS_PER_SOL; // Keep 0.01 SOL for fees
        const returnAmount = currentBalance - keepAmount;

        if (returnAmount > 0) {
          // Transfer excess SOL back to authority
          const transferIx = anchor.web3.SystemProgram.transfer({
            fromPubkey: user.publicKey,
            toPubkey: authority,
            lamports: returnAmount,
          });

          const tx = new anchor.web3.Transaction().add(transferIx);
          const latestBlockhash = await connection.getLatestBlockhash();
          tx.recentBlockhash = latestBlockhash.blockhash;
          tx.feePayer = user.publicKey;
          tx.sign(user);

          const sig = await connection.sendRawTransaction(tx.serialize());
          await connection.confirmTransaction({
            signature: sig,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          });

          console.log(
            `User ${i + 1}: Returned ${returnAmount / anchor.web3.LAMPORTS_PER_SOL} SOL to authority`
          );
        }
      } catch (e) {
        console.log(`Failed to return SOL for user ${i + 1}:`, e);
      }
    } catch (e) {
      console.log(`Error during cleanup for user ${i + 1}:`, e);
    }
  }

  console.log('Cleanup complete.');
}
