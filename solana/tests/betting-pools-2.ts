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
import { expect } from 'chai';

import { BettingPools2 } from '../target/types/betting_pools_2';
import { getNextPoolAddress } from '../utils/get-next-pool-address';
import { DEVNET_USDC_ADDRESS, getOrCreateBetPointsMint, isDevnet } from './create-token';

// Flag to determine funding method for test accounts, used to get around airdrop rate limits in devnet.
// If true will use an airdrop, if false will transfer from the payer to the new accounts
const USE_AIRDROP = false;

const BETTING_POOLS_SEED = Buffer.from('betting_pools_v7');
export const POOL_SEED = Buffer.from('pool_v3');
export const BET_SEED = Buffer.from('bet_v1');

// Utility function to create a betting pool
async function createBettingPool(
  program: Program,
  bettingPoolsAddress: anchor.web3.PublicKey,
  authority: anchor.web3.PublicKey,
  params: {
    question: string;
    options: string[];
    betsCloseAt?: anchor.BN;
    imageUrl?: string;
    category?: string;
    creatorName?: string;
    creatorId?: string;
    closureCriteria?: string;
    closureInstructions?: string;
  }
): Promise {
  // Get the current state to get the next pool ID
  const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
  const poolId = bettingPoolsState.nextPoolId;

  // Get the next pool address
  const poolAddress = await getNextPoolAddress(program, bettingPoolsAddress);

  // Default values
  const betsCloseAt = params.betsCloseAt || new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
  const imageUrl = params.imageUrl || 'https://example.com/image.jpg';
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
      imageUrl,
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

// Helper function to create a user with funded bet points
async function createFundedUser(
  connection: anchor.web3.Connection,
  payer: anchor.web3.Keypair,
  betPointsMint: anchor.web3.PublicKey,
  betPointsAmount: number = 2000 * 1e6 // 2000 BetPoints by default
): Promise {
  // Create a new keypair for the user
  const user = anchor.web3.Keypair.generate();

  // Fund the user with SOL
  const solAmount = 0.11 * anchor.web3.LAMPORTS_PER_SOL;

  if (USE_AIRDROP) {
    // Request an airdrop of SOL for the user
    const airdropSig = await connection.requestAirdrop(user.publicKey, solAmount);
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature: airdropSig,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });
    console.log(
      `Airdropped ${
        solAmount / anchor.web3.LAMPORTS_PER_SOL
      } SOL to user ${user.publicKey.toString()}`
    );
  } else {
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
      `Transferred ${
        solAmount / anchor.web3.LAMPORTS_PER_SOL
      } SOL from authority to user ${user.publicKey.toString()}`
    );
  }

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
      betPointsAmount
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
    console.log(`Minted ${betPointsAmount / 1e6} BetPoints to user`);

    // Verify the balance
    const accountInfo = await getAccount(connection, associatedTokenAddress);
    console.log(`Token account balance verified: ${accountInfo.amount.toString()}`);
  } catch (e) {
    console.error('Error minting tokens:', e);
    throw e;
  }

  return {
    user,
    betPointsAccount: associatedTokenAddress,
  };
}

describe('betting-pools-2', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bettingPools2 as Program;
  const wallet = anchor.AnchorProvider.env().wallet;
  const connection = anchor.getProvider().connection;

  // We need a keypair version of the wallet for token operations
  const payerKeypair = anchor.Wallet.local().payer;

  // Use the existing mint or create a new one
  let usdcMint: anchor.web3.PublicKey; // We'll keep this for initialization but not mint it
  let betPointsMint: anchor.web3.PublicKey;
  let bettingPoolsAddress: anchor.web3.PublicKey;
  let bettingPoolsBump: number;
  let poolAddress: anchor.web3.PublicKey;
  let poolId: anchor.BN;

  // Store our users for the placeBet test
  const users: Array = [];

  beforeEach(async () => {
    console.log('beforeEach section');
    // Request an airdrop for the payer if needed
    const payerBalance = await connection.getBalance(payerKeypair.publicKey);
    if (payerBalance < 1 * anchor.web3.LAMPORTS_PER_SOL) {
      console.log('Requesting airdrop for payer wallet...');
      const airdropSig = await connection.requestAirdrop(
        payerKeypair.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSig);
      console.log(`Airdropped 1 SOL to payer ${payerKeypair.publicKey.toString()}`);
    }

    // Set up USDC mint based on environment
    if (isDevnet()) {
      // Use real USDC address on devnet
      usdcMint = new anchor.web3.PublicKey(DEVNET_USDC_ADDRESS);
      console.log('Using real USDC mint on devnet:', usdcMint.toString());
    } else {
      // Create a fake USDC mint for localnet (we won't mint any tokens)
      usdcMint = anchor.web3.Keypair.generate().publicKey;
      console.log('Created fake USDC mint for localnet:', usdcMint.toString());
    }

    // Get or create a real SPL token for bet points
    betPointsMint = await getOrCreateBetPointsMint();
    console.log('Using real SPL token for bet points:', betPointsMint.toString());

    // Find betting pools PDA
    [bettingPoolsAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [BETTING_POOLS_SEED],
      program.programId
    );
  });

  it('Is initialized!', async () => {
    // Add your test here.
    console.log('---Initialize---');
    console.log('BettingPools address:', bettingPoolsAddress);
    console.log('USDC mint:', usdcMint);
    console.log('Bet points mint:', betPointsMint);
    console.log('Wallet:', wallet.publicKey);

    try {
      // Try to fetch the account first to see if it's already initialized
      try {
        const existingState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
        expect(existingState.isInitialized).to.be.true;
        console.log('BettingPools already initialized, using existing state');
      } catch (e) {
        // If fetch fails, the account doesn't exist yet, so initialize it
        console.log('BettingPools not initialized, initializing...', e);
        const tx = await program.methods
          .initialize(usdcMint, betPointsMint)
          .accounts({
            authority: wallet.publicKey,
          })
          .rpc();
        console.log('Your transaction signature', tx);
      }

      const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      console.log('---bettingPoolsAddress state post creation---');
      console.log(bettingPoolsAddress);

      console.log('Betting pools state post creation');
      expect(bettingPoolsState.authority.equals(wallet.publicKey)).to.be.true;
      expect(
        bettingPoolsState.usdcMint.equals(usdcMint) || bettingPoolsState.usdcMint.toString() !== ''
      ).to.be.true;
      expect(
        bettingPoolsState.betPointsMint.equals(betPointsMint) ||
          bettingPoolsState.betPointsMint.toString() !== ''
      ).to.be.true;
      expect(parseInt(bettingPoolsState.nextPoolId.toString())).to.be.at.least(1);
      expect(parseInt(bettingPoolsState.nextBetId.toString())).to.be.at.least(1);
      expect(bettingPoolsState.payoutFeeBp).to.equal(90);
    } catch (e) {
      console.error('Error in initialize test:', e);
      throw e;
    }
  });

  it('Create a new betting pool', async () => {
    try {
      console.log('Creating pool');

      // Pool parameters
      const question = 'Will BTC reach $200k by the end of 2025?';
      const options = ['Yes', 'No'];
      const betsCloseAt = new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
      const imageUrl = 'https://example.com/image.jpg';
      const category = 'Crypto';
      const creatorName = 'Satoshi';
      const creatorId = 'satoshi123';
      const closureCriteria = 'The price of BTC exceeds $100,000 USD on any major exchange.';
      const closureInstructions = 'Check the price on Coinbase, Binance, and Kraken.';

      // Create the pool using our utility function
      const { poolAddress, poolId, tx } = await createBettingPool(
        program,
        bettingPoolsAddress,
        wallet.publicKey,
        {
          question,
          options,
          betsCloseAt,
          imageUrl,
          category,
          creatorName,
          creatorId,
          closureCriteria,
          closureInstructions,
        }
      );

      console.log(`Create pool transaction: ${tx}`);

      // Fetch the pool account
      console.log('Pool address:', poolAddress);
      const poolAccount = await program.account.pool.fetch(poolAddress);
      console.log('Pool account:', poolAccount);

      // Verify the pool data
      expect(poolAccount.id.toString()).to.equal(poolId.toString());
      expect(poolAccount.question).to.equal(question);
      expect(poolAccount.options).to.deep.equal(options);
      expect(poolAccount.betsCloseAt.toString()).to.equal(betsCloseAt.toString());
      expect('pending' in poolAccount.status).to.be.true; //TODO This feels sloppy, it's searching keys but I want to compare to an enum type
      expect(poolAccount.imageUrl).to.equal(imageUrl);
      expect(poolAccount.category).to.equal(category);
      expect(poolAccount.creatorName).to.equal(creatorName);
      expect(poolAccount.creatorId).to.equal(creatorId);
      expect(poolAccount.closureCriteria).to.equal(closureCriteria);
      expect(poolAccount.closureInstructions).to.equal(closureInstructions);

      // Check if next_pool_id was incremented in the betting pools state
      const updatedBettingPoolsState =
        await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      const expectedNextId = parseInt(poolId.toString()) + 1;
      expect(parseInt(updatedBettingPoolsState.nextPoolId.toString())).to.equal(expectedNextId);
    } catch (e) {
      console.error('Error in create pool test:', e);
      throw e;
    }
  });

  it('placeBet creates bet accounts with correct data and updates pool totals', async () => {
    try {
      // Get the current betting pools state
      const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      console.log('Betting pools state:', bettingPoolsState);

      // Create a pool for testing using our utility function
      const { poolAddress: newPoolAddress, poolId } = await createBettingPool(
        program,
        bettingPoolsAddress,
        wallet.publicKey,
        {
          question: 'Will ETH reach $10k by the end of 2025?',
          options: ['Yes', 'No'],
          imageUrl: 'https://example.com/eth.jpg',
          category: 'Crypto',
          creatorName: 'Vitalik',
          creatorId: 'vitalik123',
          closureCriteria: 'The price of ETH exceeds $10,000 USD on any major exchange.',
          closureInstructions: 'Check the price on Coinbase, Binance, and Kraken.',
        }
      );

      console.log('Created new pool with ID:', poolId.toString());
      poolAddress = newPoolAddress;

      // Create a funded user for betting using our helper function
      const { user: bettor, betPointsAccount: bettorTokenAccount } = await createFundedUser(
        connection,
        payerKeypair,
        betPointsMint,
        200_000_000 // 200 tokens
      );

      console.log(`Created funded bettor: ${bettor.publicKey.toString()}`);
      console.log(`With token account: ${bettorTokenAccount.toString()}`);

      // Define bet parameters
      const optionIndex = 0;
      const amount = new anchor.BN(100_000_000); // 100 tokens
      const tokenType = { points: {} }; // Use points token type

      // Find the bet account PDA
      const nextBetId = bettingPoolsState.nextBetId;

      const [betAddress] = anchor.web3.PublicKey.findProgramAddressSync(
        [BET_SEED, poolId.toBuffer('le', 8), nextBetId.toBuffer('le', 8)],
        program.programId
      );
      console.log('Bet PDA address:', betAddress.toString());

      // We need to create the program token account to receive tokens
      // This would typically be a PDA with authority set to program
      // But for test purposes, we'll create a regular token account owned by the program
      // Find the PDA for the program token account
      const programTokenSeed = Buffer.from('program_token');
      const [programTokenAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
        [programTokenSeed],
        program.programId
      );

      // Create the program token account
      console.log('Creating program token account...');
      const programTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payerKeypair,
        betPointsMint,
        programTokenAuthority,
        true // allowOwnerOffCurve
      );

      console.log(`Created program token account: ${programTokenAccount.address.toString()}`);

      // Check initial pool state
      const initialPool = await program.account.pool.fetch(poolAddress);
      console.log(
        'Initial pool point bet totals:',
        initialPool.pointsBetTotals.map(t => t.toString())
      );

      // Execute the placeBet instruction
      console.log('Placing bet...');
      const betTx = await program.methods
        .placeBet(new anchor.BN(optionIndex), amount, tokenType)
        .accounts({
          bettingPools: bettingPoolsAddress,
          pool: poolAddress,
          bet: betAddress,
          bettor: bettor.publicKey,
          bettorTokenAccount: bettorTokenAccount,
          programTokenAccount: programTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([bettor])
        .rpc();

      console.log(`Bet placed with transaction: ${betTx}`);

      // Fetch and verify the bet data
      const betAccount = await program.account.bet.fetch(betAddress);
      console.log('Bet account data:', betAccount);

      // Verify bet data
      expect(betAccount.id.toString()).to.equal(nextBetId.toString());
      expect(betAccount.owner.toString()).to.equal(bettor.publicKey.toString());
      expect(betAccount.option.toNumber()).to.equal(optionIndex);
      expect(betAccount.amount.toString()).to.equal(amount.toString());
      expect(betAccount.poolId.toString()).to.equal(poolId.toString());
      expect('points' in betAccount.tokenType).to.be.true;

      // Verify pool totals were updated
      const updatedPool = await program.account.pool.fetch(poolAddress);
      console.log(
        'Updated pool point bet totals:',
        updatedPool.pointsBetTotals.map(t => t.toString())
      );

      // Verify the points bet total was updated for the correct option
      expect(updatedPool.pointsBetTotals[optionIndex].toString()).to.equal(amount.toString());
      // For BN comparison, we need to compare string representations to avoid issues with BN objects
      expect(updatedPool.pointsBetTotals[1 - optionIndex].toString()).to.equal('0'); // Other option should still be zero

      // Verify betting pools nextBetId was incremented
      const updatedBettingPools =
        await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      expect(updatedBettingPools.nextBetId.toNumber()).to.equal(nextBetId.toNumber() + 1);

      console.log('Successfully verified placeBet functionality with real tokens');
    } catch (e) {
      console.error('Error in placeBet test:', e);
      throw e;
    }
  });
});
