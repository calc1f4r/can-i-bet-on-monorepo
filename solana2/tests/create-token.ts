import * as anchor from '@coral-xyz/anchor';
import {
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import { expect } from 'chai';

// Constants for SPL token
const TOKEN_NAME = 'Betting Points';
const TOKEN_SYMBOL = 'BPT';
const TOKEN_DECIMALS = 6; // Match USDC decimals to make our lives easier
const TOKEN_INITIAL_SUPPLY = 1_000_000 * Math.pow(10, TOKEN_DECIMALS); // 1 million tokens

// export let existingMintAddress: anchor.web3.PublicKey | null = null;
export let existingMintAddress: anchor.web3.PublicKey | null = new anchor.web3.PublicKey(
  '8ZfwTfaixHgAdrsz6G1eJJvxrZPS8NCR7aCZKruF8jJj'
);
// new anchor.web3.PublicKey("M484ioijKrAKuekDfCXXmQAtbsbJzMY5kGbNoZ5LVKz");

describe('create-token', () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();

  it('Creates an SPL token for betting points', async () => {
    console.log('Using wallet:', provider.wallet.publicKey.toString());
    console.log('Using cluster:', provider.connection.rpcEndpoint);

    let mintAddress;

    try {
      if (existingMintAddress) {
        mintAddress = existingMintAddress;
        console.log(`Using existing token mint: ${mintAddress.toString()}`);

        // Verify the mint exists
        const mintInfo = await provider.connection.getAccountInfo(mintAddress);
        expect(mintInfo).to.not.be.null;
        console.log('Verified existing token mint:', mintAddress.toString());
      } else {
        // Create new token
        console.log(`Creating new SPL token: ${TOKEN_NAME} (${TOKEN_SYMBOL})`);
        console.log(`Decimals: ${TOKEN_DECIMALS}`);

        // Create the mint account
        mintAddress = await createMint(
          provider.connection,
          provider.wallet.payer, // payer
          provider.wallet.publicKey, // mint authority
          provider.wallet.publicKey, // freeze authority (you can use null for no freeze)
          TOKEN_DECIMALS
        );
        console.log('Token mint created:', mintAddress.toString());

        // Create associated token account for the wallet
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
          provider.connection,
          provider.wallet.payer,
          mintAddress,
          provider.wallet.publicKey
        );
        console.log('Token account created:', tokenAccount.address.toString());

        // Mint initial supply to the wallet
        await mintTo(
          provider.connection,
          provider.wallet.payer,
          mintAddress,
          tokenAccount.address,
          provider.wallet.publicKey, // authority
          TOKEN_INITIAL_SUPPLY
        );
        console.log(
          `Minted ${TOKEN_INITIAL_SUPPLY / Math.pow(10, TOKEN_DECIMALS)} ${TOKEN_SYMBOL} to wallet`
        );

        // Verify the token account balance
        const tokenAccountInfo = await getAccount(provider.connection, tokenAccount.address);
        expect(tokenAccountInfo.amount.toString()).to.equal(TOKEN_INITIAL_SUPPLY.toString());

        // Store token info in global variable
        existingMintAddress = mintAddress;

        // Output token configuration for manual copy
        console.log('\n==== TOKEN CONFIGURATION ====\n');
        console.log(JSON.stringify({ mintAddress: mintAddress.toString() }, null, 2));
        console.log('\n============================\n');
        console.log('⚠️ Please copy this token configuration if needed for other tests');
      }

      // Return the token config for use in other tests
      return { mintAddress };
    } catch (error) {
      console.error('Error in token creation test:', error);
      throw error;
    }
  });
});

// Export function to be used by other tests
export async function getOrCreateBetPointsMint(): Promise<anchor.web3.PublicKey> {
  const provider = anchor.AnchorProvider.env();

  // Check if we have a global mint address
  if (existingMintAddress) {
    return existingMintAddress;
  }

  // If not, create a new token
  console.log(`Creating new SPL token: ${TOKEN_NAME} (${TOKEN_SYMBOL})`);

  // Create the mint account
  const mintAddress = await createMint(
    provider.connection,
    provider.wallet.payer,
    provider.wallet.publicKey,
    provider.wallet.publicKey,
    TOKEN_DECIMALS
  );

  // Create associated token account for the wallet
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    provider.wallet.payer,
    mintAddress,
    provider.wallet.publicKey
  );

  // Mint initial supply to the wallet
  await mintTo(
    provider.connection,
    provider.wallet.payer,
    mintAddress,
    tokenAccount.address,
    provider.wallet.publicKey,
    TOKEN_INITIAL_SUPPLY
  );

  // Store the mint address in the global variable
  existingMintAddress = mintAddress;

  // Output token configuration for manual copy
  console.log('\n==== TOKEN CONFIGURATION ====\n');
  console.log(JSON.stringify({ mintAddress: mintAddress.toString() }, null, 2));
  console.log('\n============================\n');
  console.log('⚠️ Please copy this token configuration if needed for other tests');

  return mintAddress;
}
