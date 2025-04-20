import { BigInt } from '@graphprotocol/graph-ts';
import { Protobuf } from 'as-proto';

import { Bet, BetPlaced, Pool, PoolCreated } from '../generated/schema';
import { Data as protoData } from './pb/substreams/v1/program/Data';

function mapTokenType(tokenType: i32): string {
  if (tokenType === 0) return 'USDC';
  if (tokenType === 1) return 'POINTS';
  return 'USDC'; // Default
}

function mapBetOutcome(outcome: i32): string {
  if (outcome === 0) return 'NONE';
  if (outcome === 1) return 'WON';
  if (outcome === 2) return 'LOST';
  if (outcome === 3) return 'VOIDED';
  if (outcome === 4) return 'DRAW';
  return 'NONE'; // Default
}

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<protoData>(bytes, protoData.decode);

  // Handle PoolCreated events
  input.poolCreatedEventList.forEach(event => {
    // Create PoolCreated entity
    let poolCreatedEntity = new PoolCreated(`${event.poolId}`);
    poolCreatedEntity.txHash = event.txHash;
    poolCreatedEntity.poolId = BigInt.fromU64(event.poolId);
    poolCreatedEntity.question = event.question;
    poolCreatedEntity.options = event.options;
    poolCreatedEntity.betsCloseAt = BigInt.fromI64(event.betsCloseAt);
    poolCreatedEntity.imageUrl = event.imageUrl;
    poolCreatedEntity.category = event.category;
    poolCreatedEntity.creatorName = event.creatorName;
    poolCreatedEntity.creatorId = event.creatorId;
    poolCreatedEntity.closureCriteria = event.closureCriteria;
    poolCreatedEntity.closureInstructions = event.closureInstructions;
    poolCreatedEntity.createdAt = BigInt.fromI64(event.createdAt);
    poolCreatedEntity.save();

    // Create Pool entity
    let poolEntity = new Pool(`${event.poolId}`);
    poolEntity.poolIntId = BigInt.fromU64(event.poolId);
    poolEntity.question = event.question;
    poolEntity.options = event.options;
    poolEntity.betsCloseAt = BigInt.fromI64(event.betsCloseAt);
    poolEntity.decisionTime = BigInt.fromI64(0); // Default value
    poolEntity.usdcBetTotalsByOption = [BigInt.fromI64(0), BigInt.fromI64(0)]; // Initialize with zeros
    poolEntity.pointsBetTotalsByOption = [BigInt.fromI64(0), BigInt.fromI64(0)]; // Initialize with zeros
    poolEntity.winningOption = BigInt.fromI64(0); // Default value
    poolEntity.status = 'PENDING'; // Default status
    poolEntity.isDraw = false; // Default value
    poolEntity.createdAt = BigInt.fromI64(event.createdAt); // Current timestamp
    poolEntity.category = event.category;
    poolEntity.creatorName = event.creatorName;
    poolEntity.creatorId = event.creatorId;
    poolEntity.closureCriteria = event.closureCriteria;
    poolEntity.closureInstructions = event.closureInstructions;
    poolEntity.imageUrl = event.imageUrl;
    poolEntity.twitterPostId = ''; // Default empty string
    poolEntity.creationTxHash = event.txHash;
    poolEntity.save();
  });

  // Handle BetPlaced events
  input.betPlacedEventList.forEach(event => {
    // Create Bet entity
    const betId = `${event.betId}`;
    let betEntity = new Bet(betId);
    betEntity.betIntId = BigInt.fromU64(event.betId);
    betEntity.poolIntId = BigInt.fromU64(event.poolId);
    betEntity.pool = event.poolId.toString();
    betEntity.userAddress = event.user;
    betEntity.optionIndex = BigInt.fromU64(event.optionIndex);
    betEntity.amount = BigInt.fromU64(event.amount);
    // Use the created_at value from the event
    betEntity.createdAt = BigInt.fromI64(event.createdAt);
    // Keep updatedAt field for backward compatibility, set to same value as createdAt
    betEntity.updatedAt = BigInt.fromI64(event.createdAt);
    betEntity.isPayedOut = false;
    betEntity.outcome = 'NONE';
    betEntity.tokenType = mapTokenType(event.tokenType);
    betEntity.transactionHash = event.txHash;
    betEntity.save();

    // Create BetPlaced entity
    const betPlacedId = `${event.txHash}-${event.betId}`;
    let betPlacedEntity = new BetPlaced(betPlacedId);
    betPlacedEntity.betId = BigInt.fromU64(event.betId);
    betPlacedEntity.poolId = BigInt.fromU64(event.poolId);
    betPlacedEntity.user = event.user;
    betPlacedEntity.optionIndex = BigInt.fromU64(event.optionIndex);
    betPlacedEntity.amount = BigInt.fromU64(event.amount);
    betPlacedEntity.tokenType = mapTokenType(event.tokenType);
    betPlacedEntity.createdAt = BigInt.fromI64(event.createdAt);
    betPlacedEntity.transactionHash = event.txHash;
    betPlacedEntity.bet = betId;
    betPlacedEntity.pool = event.poolId.toString();
    betPlacedEntity.save();

    // Update Pool totals
    const poolId = event.poolId.toString();
    let poolEntity = Pool.load(poolId);
    if (poolEntity) {
      const optionIndex = event.optionIndex as i32; // Explicit cast to i32
      const amount = BigInt.fromU64(event.amount);

      if (event.tokenType === 0) {
        // USDC
        let usdcTotals = poolEntity.usdcBetTotalsByOption;
        if (optionIndex < usdcTotals.length) {
          usdcTotals[optionIndex] = usdcTotals[optionIndex].plus(amount);
          poolEntity.usdcBetTotalsByOption = usdcTotals;
        }
      } else if (event.tokenType === 1) {
        // POINTS
        let pointsTotals = poolEntity.pointsBetTotalsByOption;
        if (optionIndex < pointsTotals.length) {
          pointsTotals[optionIndex] = pointsTotals[optionIndex].plus(amount);
          poolEntity.pointsBetTotalsByOption = pointsTotals;
        }
      }

      poolEntity.save();
    }
  });

  // for (let i = 0; i < input.data.length; i++) {
  //   const event = input.data[i];
  //   if (event.transfer != null) {
  //     let entity_id: string = `${event.txnId}-${i}`;
  //     const entity = new MyTransfer(entity_id);
  //     entity.amount = event.transfer!.instruction!.amount.toString();
  //     entity.source = event.transfer!.accounts!.source;
  //     entity.designation = event.transfer!.accounts!.destination;
  //     if (event.transfer!.accounts!.signer!.single != null) {
  //       entity.signers = [event.transfer!.accounts!.signer!.single!.signer];
  //     } else if (event.transfer!.accounts!.signer!.multisig != null) {
  //       entity.signers = event.transfer!.accounts!.signer!.multisig!.signers;
  //     }
  //     entity.save();
  //   }
  // }

  // No ID field has been found in the proto input...
  // The input has been hashed to create a unique ID, replace it with the field you want to use as ID
  // const inputHash = crypto.keccak256(Bytes.fromUint8Array(bytes)).toHexString();
  // let entity = new Pool(inputHash);

  // entity.save();
}
