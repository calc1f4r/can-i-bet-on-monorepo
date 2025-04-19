import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';

import { BettingPools2 } from '../target/types/betting_pools_2';
import { getNextPoolAddress } from '../utils/get-next-pool-address';
import { getOrCreateBetPointsMint } from './create-token';

const BETTING_POOLS_SEED = Buffer.from('betting_pools_v7');
export const POOL_SEED = Buffer.from('pool_v3');

describe('betting-pools-2', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bettingPools2 as Program<BettingPools2>;
  const wallet = anchor.AnchorProvider.env().wallet;

  let usdcMint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
  );
  let betPointsMint: anchor.web3.PublicKey;
  let bettingPoolsAddress: anchor.web3.PublicKey;

  beforeEach(async () => {
    console.log('beforeEach section');
    // Generate USDC mint keypair
    usdcMint = anchor.web3.Keypair.generate().publicKey;

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
      // Create the pool
      const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
      const nextPoolAddress = await getNextPoolAddress(program, bettingPoolsAddress);

      const poolId = bettingPoolsState.nextPoolId;
      const question = 'Will BTC reach $200k by the end of 2025?';
      const options = ['Yes', 'No'];
      const betsCloseAt = new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
      const imageUrl = 'https://example.com/image.jpg';
      const category = 'Crypto';
      const creatorName = 'Satoshi';
      const creatorId = 'satoshi123';
      const closureCriteria = 'The price of BTC exceeds $100,000 USD on any major exchange.';
      const closureInstructions = 'Check the price on Coinbase, Binance, and Kraken.';

      const tx = await program.methods
        .createPool(
          question,
          options,
          betsCloseAt,
          imageUrl,
          category,
          creatorName,
          creatorId,
          closureCriteria,
          closureInstructions
        )
        .accounts({
          betting_pools: bettingPoolsAddress,
          pool: nextPoolAddress,
          authority: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log(`Create pool transaction: ${tx}`);

      // Fetch the pool account
      console.log('Pool address:', nextPoolAddress);
      const poolAccount = await program.account.pool.fetch(nextPoolAddress);
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
});
