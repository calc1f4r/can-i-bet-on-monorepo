import { BigInt, Bytes, dataSource } from '@graphprotocol/graph-ts';

import {
  BetPlaced as BetPlacedEvent,
  PayoutClaimed as PayoutClaimedEvent,
  PoolClosed as PoolClosedEvent,
  PoolCreated as PoolCreatedEvent,
  TwitterPostIdSet as TwitterPostIdSetEvent,
} from '../generated/BettingPools/BettingPools';
import {
  Bet,
  BetPlaced,
  PayoutClaimed,
  Pool,
  PoolClosed,
  PoolCreated,
  TwitterPostIdSet,
} from '../generated/schema';

const chainIdToNetworkName = (networkName: string): i32 => {
  if (networkName == 'base-sepolia') return 84532;
  if (networkName == 'base') return 8453;
  if (networkName == 'mainnet') return 1;
  if (networkName == 'sepolia') return 11155111;
  if (networkName == 'arbitrum-sepolia') return 421614;
  if (networkName == 'arbitrum') return 42161;
  if (networkName == 'optimism-sepolia') return 111550111;
  if (networkName == 'optimism') return 10;
  if (networkName == 'scroll-sepolia') return 534351;
  if (networkName == 'scroll') return 534352;

  throw new Error(`Network ${networkName} not supported`);
};

export function handleBetPlaced(event: BetPlacedEvent): void {
  // dataSource.network()
  const betId = event.params.betId.toString();
  const poolId = event.params.poolId.toString();

  const networkName = dataSource.network();
  const chainId = chainIdToNetworkName(networkName);
  // Create BetPlaced entity
  const entity = new BetPlaced(betId);
  entity.betId = event.params.betId;
  entity.poolId = event.params.poolId;
  entity.user = event.params.user;
  entity.optionIndex = event.params.optionIndex;
  entity.amount = event.params.amount;
  entity.tokenType = event.params.tokenType ? 'POINTS' : 'USDC';
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.chainName = networkName;
  entity.chainId = BigInt.fromI32(chainId as i32);

  const poolCreated = PoolCreated.load(poolId);
  if (poolCreated == null) {
    throw new Error('PoolCreated not found');
  }
  entity.poolCreated = poolCreated.id;

  // Create new Bet entity
  const bet = new Bet(betId);
  bet.betIntId = event.params.betId;
  bet.poolIntId = event.params.poolId;
  bet.poolIdHex = Bytes.fromUTF8(poolId);
  bet.pool = poolId;
  bet.user = event.params.user;
  bet.optionIndex = event.params.optionIndex;
  bet.amount = event.params.amount;
  bet.tokenType = event.params.tokenType == 1 ? 'POINTS' : 'USDC';
  bet.createdAt = event.block.timestamp;
  bet.updatedAt = event.block.timestamp;
  bet.blockNumber = event.block.number;
  bet.blockTimestamp = event.block.timestamp;
  bet.transactionHash = event.transaction.hash;
  bet.chainName = networkName;
  bet.chainId = BigInt.fromI32(chainId as i32);
  bet.payoutClaimed = false;
  bet.payoutClaimedBlockNumber = null;
  bet.payoutClaimedBlockTimestamp = null;
  bet.payoutClaimedTransactionHash = null;
  bet.userAddress = event.params.user;
  bet.outcome = 'NONE';

  // Update Pool totals and timestamps
  const pool = Pool.load(poolId);
  if (pool == null) {
    throw new Error('Pool not found');
  }

  // Update the appropriate bet totals based on tokenType
  if (event.params.tokenType == 0) {
    // USDC
    const usdcTotals = pool.usdcBetTotalsByOption;
    usdcTotals[event.params.optionIndex.toI32()] = usdcTotals[
      event.params.optionIndex.toI32()
    ].plus(event.params.amount);
    pool.usdcBetTotalsByOption = usdcTotals;
    pool.usdcVolume = pool.usdcVolume.plus(event.params.amount);
  } else {
    // POINTS
    const pointsTotals = pool.pointsBetTotalsByOption;
    pointsTotals[event.params.optionIndex.toI32()] = pointsTotals[
      event.params.optionIndex.toI32()
    ].plus(event.params.amount);
    pool.pointsBetTotalsByOption = pointsTotals;
    pool.pointsVolume = pool.pointsVolume.plus(event.params.amount);
  }

  // Update lastUpdated timestamps
  pool.lastUpdatedBlockNumber = event.block.number;
  pool.lastUpdatedBlockTimestamp = event.block.timestamp;
  pool.lastUpdatedTransactionHash = event.transaction.hash;

  pool.save();
  bet.save();
  entity.save();
}

export function handlePoolClosed(event: PoolClosedEvent): void {
  const poolId = event.params.poolId.toString();

  const networkName = dataSource.network();
  const chainId = chainIdToNetworkName(networkName);

  // Create PoolClosed entity
  const entity = new PoolClosed(poolId);
  entity.poolId = event.params.poolId;
  entity.selectedOption = event.params.selectedOption;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.chainName = networkName;
  entity.chainId = BigInt.fromI32(chainId as i32);

  // Update Pool status and timestamps
  const pool = Pool.load(poolId);
  if (pool == null) {
    throw new Error('Pool not found');
  }
  pool.selectedOption = event.params.selectedOption;
  pool.status = 'GRADED';
  pool.decisionTime = event.params.decisionTime;

  // Update graded timestamps
  pool.gradedBlockNumber = event.block.number;
  pool.gradedBlockTimestamp = event.block.timestamp;
  pool.gradedTransactionHash = event.transaction.hash;

  pool.save();
  entity.save();
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  const poolId = event.params.poolId.toString();

  const networkName = dataSource.network();
  const chainId = chainIdToNetworkName(networkName);

  // Create PoolCreated entity
  const entity = new PoolCreated(poolId);
  entity.poolId = event.params.poolId;
  entity.creatorId = event.params.params.creatorId;
  entity.question = event.params.params.question;
  entity.options = event.params.params.options;
  entity.betsCloseAt = event.params.params.betsCloseAt;
  entity.decisionTime = BigInt.fromI32(0); // Initialize with 0
  entity.imageUrl = event.params.params.imageUrl;
  entity.category = event.params.params.category;
  entity.creatorName = event.params.params.creatorName;
  entity.closureCriteria = event.params.params.closureCriteria;
  entity.closureInstructions = event.params.params.closureInstructions;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.chainName = networkName;
  entity.chainId = BigInt.fromI32(chainId as i32);

  // Create new Pool entity
  const pool = new Pool(poolId);
  pool.poolIntId = event.params.poolId;
  pool.question = event.params.params.question;
  pool.options = event.params.params.options;
  pool.usdcBetTotalsByOption = [BigInt.fromI32(0), BigInt.fromI32(0)];
  pool.pointsBetTotalsByOption = [BigInt.fromI32(0), BigInt.fromI32(0)];
  pool.usdcVolume = BigInt.fromI32(0);
  pool.pointsVolume = BigInt.fromI32(0);
  pool.selectedOption = BigInt.fromI32(0);
  pool.status = 'PENDING';
  pool.imageUrl = event.params.params.imageUrl;
  pool.category = event.params.params.category;
  pool.creatorId = event.params.params.creatorId;
  pool.creatorName = event.params.params.creatorName;
  pool.closureCriteria = event.params.params.closureCriteria;
  pool.closureInstructions = event.params.params.closureInstructions;
  pool.betsCloseAt = event.params.params.betsCloseAt;
  pool.decisionTime = BigInt.fromI32(0); // Initialize with 0
  pool.chainName = networkName;
  pool.chainId = BigInt.fromI32(chainId as i32);
  pool.isDraw = false;
  pool.xPostId = '';
  // Set initial timestamps
  pool.createdBlockNumber = event.block.number;
  pool.createdBlockTimestamp = event.block.timestamp;
  pool.createdTransactionHash = event.transaction.hash;

  // Initialize lastUpdated timestamps to match created timestamps
  pool.lastUpdatedBlockNumber = event.block.number;
  pool.lastUpdatedBlockTimestamp = event.block.timestamp;
  pool.lastUpdatedTransactionHash = event.transaction.hash;

  // Initialize graded timestamps to zero
  pool.gradedBlockNumber = BigInt.fromI32(0);
  pool.gradedBlockTimestamp = BigInt.fromI32(0);
  pool.gradedTransactionHash = Bytes.empty();

  pool.save();
  entity.save();
}

export function handleTwitterPostIdSet(event: TwitterPostIdSetEvent): void {
  const poolId = event.params.poolId.toString();

  const entity = new TwitterPostIdSet(poolId);
  entity.poolIntId = event.params.poolId;
  entity.poolIdHex = Bytes.fromUTF8(poolId);
  entity.xPostId = event.params.twitterPostId;
  entity.pool = poolId;

  const pool = Pool.load(poolId);
  if (pool == null) {
    throw new Error(`Pool ${poolId} (event: ${event.params.poolId}) not found`);
  }
  pool.xPostId = event.params.twitterPostId;

  pool.lastUpdatedBlockNumber = event.block.number;
  pool.lastUpdatedBlockTimestamp = event.block.timestamp;
  pool.lastUpdatedTransactionHash = event.transaction.hash;

  pool.save();
  entity.save();
}

export function handlePayoutClaimed(event: PayoutClaimedEvent): void {
  // ResolutionCode enum values as strings
  const betId = event.params.betId.toString();
  const poolId = event.params.poolId.toString();

  const networkName = dataSource.network();
  const chainId = chainIdToNetworkName(networkName);

  // Create PayoutClaimed entity
  const entity = new PayoutClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.betId = event.params.betId;
  entity.poolId = event.params.poolId;
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.tokenType = event.params.tokenType ? 'POINTS' : 'USDC';
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.chainName = networkName;
  entity.chainId = BigInt.fromI32(chainId as i32);
  entity.bet = betId;
  entity.pool = poolId;

  // Set the resolution code from the event parameter
  const resolutionCodeValue = event.params.resolution;
  let outcome: string;

  if (resolutionCodeValue == 0) {
    outcome = 'NONE';
  } else if (resolutionCodeValue == 1) {
    outcome = 'WON';
  } else if (resolutionCodeValue == 2) {
    outcome = 'LOST';
  } else if (resolutionCodeValue == 3) {
    outcome = 'VOIDED';
  } else if (resolutionCodeValue == 4) {
    outcome = 'DRAW';
  } else {
    outcome = 'NONE';
  }

  entity.outcome = outcome;

  // Update Bet entity
  const bet = Bet.load(betId);
  if (bet == null) {
    throw new Error('Bet not found');
  }
  bet.payoutClaimed = true;
  bet.payoutClaimedBlockNumber = event.block.number;
  bet.payoutClaimedBlockTimestamp = event.block.timestamp;
  bet.payoutClaimedTransactionHash = event.transaction.hash;
  bet.outcome = outcome;

  bet.save();
  entity.save();
}
