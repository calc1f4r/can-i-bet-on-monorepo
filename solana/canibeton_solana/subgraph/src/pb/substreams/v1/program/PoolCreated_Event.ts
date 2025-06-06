// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.3
import { Reader, Writer } from 'as-proto/assembly';

export class PoolCreated_Event {
  static encode(message: PoolCreated_Event, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.txHash);

    writer.uint32(16);
    writer.uint64(message.poolId);

    writer.uint32(26);
    writer.string(message.question);

    const options = message.options;
    if (options.length !== 0) {
      for (let i: i32 = 0; i < options.length; ++i) {
        writer.uint32(34);
        writer.string(options[i]);
      }
    }

    writer.uint32(40);
    writer.int64(message.betsCloseAt);

    writer.uint32(50);
    writer.string(message.mediaUrl);

    writer.uint32(56);
    writer.int32(message.mediaType);

    writer.uint32(66);
    writer.string(message.category);

    writer.uint32(74);
    writer.string(message.creatorName);

    writer.uint32(82);
    writer.string(message.creatorId);

    writer.uint32(90);
    writer.string(message.closureCriteria);

    writer.uint32(98);
    writer.string(message.closureInstructions);

    writer.uint32(104);
    writer.int64(message.createdAt);
  }

  static decode(reader: Reader, length: i32): PoolCreated_Event {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PoolCreated_Event();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txHash = reader.string();
          break;

        case 2:
          message.poolId = reader.uint64();
          break;

        case 3:
          message.question = reader.string();
          break;

        case 4:
          message.options.push(reader.string());
          break;

        case 5:
          message.betsCloseAt = reader.int64();
          break;

        case 6:
          message.mediaUrl = reader.string();
          break;

        case 7:
          message.mediaType = reader.int32();
          break;

        case 8:
          message.category = reader.string();
          break;

        case 9:
          message.creatorName = reader.string();
          break;

        case 10:
          message.creatorId = reader.string();
          break;

        case 11:
          message.closureCriteria = reader.string();
          break;

        case 12:
          message.closureInstructions = reader.string();
          break;

        case 13:
          message.createdAt = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  txHash: string;
  poolId: u64;
  question: string;
  options: Array<string>;
  betsCloseAt: i64;
  mediaUrl: string;
  mediaType: i32;
  category: string;
  creatorName: string;
  creatorId: string;
  closureCriteria: string;
  closureInstructions: string;
  createdAt: i64;

  constructor(
    txHash: string = '',
    poolId: u64 = 0,
    question: string = '',
    options: Array<string> = [],
    betsCloseAt: i64 = 0,
    mediaUrl: string = '',
    mediaType: i32 = 0,
    category: string = '',
    creatorName: string = '',
    creatorId: string = '',
    closureCriteria: string = '',
    closureInstructions: string = '',
    createdAt: i64 = 0
  ) {
    this.txHash = txHash;
    this.poolId = poolId;
    this.question = question;
    this.options = options;
    this.betsCloseAt = betsCloseAt;
    this.mediaUrl = mediaUrl;
    this.mediaType = mediaType;
    this.category = category;
    this.creatorName = creatorName;
    this.creatorId = creatorId;
    this.closureCriteria = closureCriteria;
    this.closureInstructions = closureInstructions;
    this.createdAt = createdAt;
  }
}
