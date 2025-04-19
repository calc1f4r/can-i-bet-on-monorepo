import { BigInt } from '@graphprotocol/graph-ts';
import { Protobuf } from 'as-proto';

import { Pool, PoolCreated } from '../generated/schema';
import { Data as protoData } from './pb/substreams/v1/program/Data';

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<protoData>(bytes, protoData.decode);
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
