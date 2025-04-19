import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';

import { BettingPools2 } from '../target/types/betting_pools_2';
import { POOL_SEED } from '../tests/betting-pools-2';

export const getNextPoolAddress = async (
  program: Program<BettingPools2>,
  bettingPoolsAddress: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  const bettingPoolsState = await program.account.bettingPoolsState.fetch(bettingPoolsAddress);
  console.log('BettingPools state:', bettingPoolsState);

  // After fetching bettingPoolsState
  const poolIdBuffer = Buffer.alloc(8);
  poolIdBuffer.writeBigUInt64LE(BigInt(bettingPoolsState.nextPoolId.toString()));

  const [poolAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [POOL_SEED, poolIdBuffer],
    program.programId
  );
  console.log('BettingPools address from getNextPoolAddress:', bettingPoolsAddress);

  return poolAddress;
};
