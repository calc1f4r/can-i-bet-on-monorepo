import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { expect } from 'chai';

import { BettingPools2 } from '../target/types/betting_pools_2';
import { DEVNET_USDC_ADDRESS, getOrCreateBetPointsMint, isDevnet } from './create-token';
import {
  BETTING_POOLS_SEED,
  MediaType,
  createBettingPool,
  createFundedUser,
  lamportsToTokens,
  placeBet,
  returnUnusedAssets,
  tokensToLamports,
} from './utils';

describe('betting-pools-2', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bettingPools2 as Program<BettingPools2>;
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
      const mediaUrl =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.kym-cdn.com%2Fphotos%2Fimages%2Fnewsfeed%2F000%2F481%2F115%2F4cd.gif&f=1&nofb=1&ipt=e9b3647ed72f4954336041c98c5c7dba53f2c8011dd907e3d3d829d4664194d8';
      const mediaType = MediaType.Image;
      const category = 'Crypto';
      const creatorName = 'Satoshi';
      const creatorId = 'satoshi123';
      const closureCriteria = 'The price of BTC exceeds $100,000 USD on any major exchange.';
      const closureInstructions = 'Check the price on Coinbase, Binance, and Kraken.';

      // Create the program token account (to be used by all bets)
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

      // Create the pool using our utility function
      const { poolAddress, poolId, tx } = await createBettingPool(
        program,
        bettingPoolsAddress,
        wallet.publicKey,
        {
          question,
          options,
          betsCloseAt,
          mediaUrl,
          mediaType,
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
      expect(poolAccount.mediaUrl).to.equal(mediaUrl);
      expect('image' in poolAccount.mediaType).to.be.true; // Check that it's the Image type
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
    const testUsers = []; // Store users for cleanup
    try {
      // Get the current betting pools state
      const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      console.log('Betting pools state:', bettingPoolsState);

      // Create the pool for testing using our utility function
      const { poolAddress: newPoolAddress, poolId: newPoolId } = await createBettingPool(
        program,
        bettingPoolsAddress,
        wallet.publicKey,
        {
          question: 'Will ETH reach $10k by the end of 2025?',
          options: ['Yes', 'No'],
          mediaUrl: 'https://example.com/eth.jpg',
          mediaType: MediaType.Image,
          category: 'Crypto',
          creatorName: 'Vitalik',
          creatorId: 'vitalik123',
          closureCriteria: 'The price of ETH exceeds $10,000 USD on any major exchange.',
          closureInstructions: 'Check the price on Coinbase, Binance, and Kraken.',
        }
      );

      console.log('Created new pool with ID:', newPoolId.toString());
      poolAddress = newPoolAddress;
      poolId = newPoolId;

      // Create the program token account (to be used by all bets)
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

      // Predetermine the bet amounts and options for each user
      // This allows us to know exactly how many tokens each user will need
      const betPlans = [
        // User 1 bets
        { userIndex: 0, optionIndex: 0, tokenAmount: 200 }, // 200 tokens on Yes
        // User 2 bets
        { userIndex: 1, optionIndex: 1, tokenAmount: 350 }, // 350 tokens on No
        { userIndex: 1, optionIndex: 0, tokenAmount: 150 }, // 150 tokens on Yes
        // User 3 bets
        { userIndex: 2, optionIndex: 1, tokenAmount: 400 }, // 400 tokens on No
      ];

      // Calculate total tokens needed for each user
      const tokensNeededPerUser = Array(3).fill(0);
      for (const plan of betPlans) {
        tokensNeededPerUser[plan.userIndex] += plan.tokenAmount;
      }

      // Create users with exactly the amount of tokens they need
      const usersArray = [];
      for (let i = 0; i < tokensNeededPerUser.length; i++) {
        const tokensNeeded = tokensNeededPerUser[i];
        console.log(`Creating user ${i + 1} with ${tokensNeeded} tokens`);

        const fundedUser = await createFundedUser(
          connection,
          payerKeypair,
          betPointsMint,
          tokensNeeded
        );

        usersArray.push(fundedUser);
        testUsers.push(fundedUser); // Also store in cleanup array
        console.log(
          `Created user ${i + 1}: ${fundedUser.user.publicKey.toString()} with ${tokensNeeded} tokens`
        );
      }

      // Place bets according to the plan
      console.log(`Placing ${betPlans.length} predetermined bets...`);
      let nextBetId = bettingPoolsState.nextBetId;
      const optionTotals = [0, 0]; // Track total amounts for each option

      for (let i = 0; i < betPlans.length; i++) {
        const plan = betPlans[i];
        const { userIndex, optionIndex, tokenAmount } = plan;
        const { user: bettor, betPointsAccount: bettorTokenAccount } = usersArray[userIndex];

        console.log(
          `Bet ${i + 1}: User ${userIndex + 1} betting ${tokenAmount} tokens on option ${optionIndex} (${initialPool.options[optionIndex]})`
        );

        // Place the bet using the utility function
        const { transactionSignature, betAccount } = await placeBet(
          program,
          connection,
          bettingPoolsAddress,
          poolAddress,
          poolId,
          bettor,
          bettorTokenAccount,
          programTokenAccount.address,
          optionIndex,
          tokenAmount,
          nextBetId
        );

        console.log(`Bet placed with transaction: ${transactionSignature}`);

        // Basic verification
        expect(betAccount.id.toString()).to.equal(nextBetId.toString());
        expect(betAccount.owner.toString()).to.equal(bettor.publicKey.toString());
        expect(betAccount.option.toNumber()).to.equal(optionIndex);
        expect(betAccount.amount.toString()).to.equal(
          new anchor.BN(tokensToLamports(tokenAmount)).toString()
        );
        expect(betAccount.poolId.toString()).to.equal(poolId.toString());
        expect('points' in betAccount.tokenType).to.be.true;

        // Update running totals
        optionTotals[optionIndex] += tokensToLamports(tokenAmount);

        // Increment bet ID for next iteration
        nextBetId = new anchor.BN(nextBetId.toNumber() + 1);
      }

      // Verify final pool totals
      const finalPool = await program.account.pool.fetch(poolAddress);
      console.log('\nFinal bet summary:');
      console.log(`Total bets placed: ${betPlans.length}`);
      console.log(
        `Final pool point bet totals: [${finalPool.pointsBetTotals.map(t => t.toString())}]`
      );
      console.log(`Expected totals: [${optionTotals[0]}, ${optionTotals[1]}]`);

      // Verify the pool totals match our expected totals
      expect(finalPool.pointsBetTotals[0].toString()).to.equal(optionTotals[0].toString());
      expect(finalPool.pointsBetTotals[1].toString()).to.equal(optionTotals[1].toString());

      // Verify betting pools nextBetId was incremented correctly
      const updatedBettingPools =
        await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      expect(updatedBettingPools.nextBetId.toNumber()).to.equal(
        bettingPoolsState.nextBetId.toNumber() + betPlans.length
      );

      console.log('Successfully verified multiple bets from different users with real tokens');
    } catch (e) {
      console.error('Error in placeBet test:', e);
      throw e;
    } finally {
      // Return unused tokens and SOL back to authority
      if (testUsers.length > 0) {
        try {
          await returnUnusedAssets(connection, testUsers, betPointsMint, wallet.publicKey);
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }
    }
  });
});
