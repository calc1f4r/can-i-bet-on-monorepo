/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type Bet = {
  __typename?: 'Bet';
  amount: Scalars['BigInt']['output'];
  betIntId: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  optionIndex: Scalars['BigInt']['output'];
  payoutClaimed: Scalars['Boolean']['output'];
  payoutClaimedBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  payoutClaimedBlockTimestamp?: Maybe<Scalars['BigInt']['output']>;
  payoutClaimedTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  pool: Pool;
  poolIdHex: Scalars['Bytes']['output'];
  poolIntId: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  updatedAt: Scalars['BigInt']['output'];
  user: Scalars['Bytes']['output'];
};

export type BetCancelled = {
  __typename?: 'BetCancelled';
  amount: Scalars['BigInt']['output'];
  betId: Scalars['BigInt']['output'];
  betPlaced: BetPlaced;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  id: Scalars['Bytes']['output'];
  optionIndex: Scalars['BigInt']['output'];
  poolCreated: PoolCreated;
  poolId: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  user: Scalars['Bytes']['output'];
};

export type BetCancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BetCancelled_Filter>>>;
  betId?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betPlaced?: InputMaybe<Scalars['String']['input']>;
  betPlaced_?: InputMaybe<BetPlaced_Filter>;
  betPlaced_contains?: InputMaybe<Scalars['String']['input']>;
  betPlaced_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  betPlaced_ends_with?: InputMaybe<Scalars['String']['input']>;
  betPlaced_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  betPlaced_gt?: InputMaybe<Scalars['String']['input']>;
  betPlaced_gte?: InputMaybe<Scalars['String']['input']>;
  betPlaced_in?: InputMaybe<Array<Scalars['String']['input']>>;
  betPlaced_lt?: InputMaybe<Scalars['String']['input']>;
  betPlaced_lte?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_contains?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  betPlaced_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  betPlaced_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  betPlaced_starts_with?: InputMaybe<Scalars['String']['input']>;
  betPlaced_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  optionIndex?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optionIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BetCancelled_Filter>>>;
  poolCreated?: InputMaybe<Scalars['String']['input']>;
  poolCreated_?: InputMaybe<PoolCreated_Filter>;
  poolCreated_contains?: InputMaybe<Scalars['String']['input']>;
  poolCreated_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_gt?: InputMaybe<Scalars['String']['input']>;
  poolCreated_gte?: InputMaybe<Scalars['String']['input']>;
  poolCreated_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolCreated_lt?: InputMaybe<Scalars['String']['input']>;
  poolCreated_lte?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolCreated_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum BetCancelled_OrderBy {
  Amount = 'amount',
  BetId = 'betId',
  BetPlaced = 'betPlaced',
  BetPlacedAmount = 'betPlaced__amount',
  BetPlacedBetId = 'betPlaced__betId',
  BetPlacedBlockNumber = 'betPlaced__blockNumber',
  BetPlacedBlockTimestamp = 'betPlaced__blockTimestamp',
  BetPlacedChainId = 'betPlaced__chainId',
  BetPlacedChainName = 'betPlaced__chainName',
  BetPlacedId = 'betPlaced__id',
  BetPlacedOptionIndex = 'betPlaced__optionIndex',
  BetPlacedPoolId = 'betPlaced__poolId',
  BetPlacedTransactionHash = 'betPlaced__transactionHash',
  BetPlacedUser = 'betPlaced__user',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  ChainName = 'chainName',
  Id = 'id',
  OptionIndex = 'optionIndex',
  PoolCreated = 'poolCreated',
  PoolCreatedBetsCloseAt = 'poolCreated__betsCloseAt',
  PoolCreatedBlockNumber = 'poolCreated__blockNumber',
  PoolCreatedBlockTimestamp = 'poolCreated__blockTimestamp',
  PoolCreatedCategory = 'poolCreated__category',
  PoolCreatedChainId = 'poolCreated__chainId',
  PoolCreatedChainName = 'poolCreated__chainName',
  PoolCreatedClosureCriteria = 'poolCreated__closureCriteria',
  PoolCreatedClosureInstructions = 'poolCreated__closureInstructions',
  PoolCreatedCreatorId = 'poolCreated__creatorId',
  PoolCreatedCreatorName = 'poolCreated__creatorName',
  PoolCreatedDecisionDate = 'poolCreated__decisionDate',
  PoolCreatedId = 'poolCreated__id',
  PoolCreatedImageUrl = 'poolCreated__imageUrl',
  PoolCreatedPoolId = 'poolCreated__poolId',
  PoolCreatedQuestion = 'poolCreated__question',
  PoolCreatedTransactionHash = 'poolCreated__transactionHash',
  PoolId = 'poolId',
  TransactionHash = 'transactionHash',
  User = 'user'
}

export type BetPlaced = {
  __typename?: 'BetPlaced';
  amount: Scalars['BigInt']['output'];
  betId: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  id: Scalars['Bytes']['output'];
  optionIndex: Scalars['BigInt']['output'];
  poolCreated: PoolCreated;
  poolId: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  user: Scalars['Bytes']['output'];
};

export type BetPlaced_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BetPlaced_Filter>>>;
  betId?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  optionIndex?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optionIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BetPlaced_Filter>>>;
  poolCreated?: InputMaybe<Scalars['String']['input']>;
  poolCreated_?: InputMaybe<PoolCreated_Filter>;
  poolCreated_contains?: InputMaybe<Scalars['String']['input']>;
  poolCreated_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_gt?: InputMaybe<Scalars['String']['input']>;
  poolCreated_gte?: InputMaybe<Scalars['String']['input']>;
  poolCreated_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolCreated_lt?: InputMaybe<Scalars['String']['input']>;
  poolCreated_lte?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolCreated_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolCreated_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolCreated_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum BetPlaced_OrderBy {
  Amount = 'amount',
  BetId = 'betId',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  ChainName = 'chainName',
  Id = 'id',
  OptionIndex = 'optionIndex',
  PoolCreated = 'poolCreated',
  PoolCreatedBetsCloseAt = 'poolCreated__betsCloseAt',
  PoolCreatedBlockNumber = 'poolCreated__blockNumber',
  PoolCreatedBlockTimestamp = 'poolCreated__blockTimestamp',
  PoolCreatedCategory = 'poolCreated__category',
  PoolCreatedChainId = 'poolCreated__chainId',
  PoolCreatedChainName = 'poolCreated__chainName',
  PoolCreatedClosureCriteria = 'poolCreated__closureCriteria',
  PoolCreatedClosureInstructions = 'poolCreated__closureInstructions',
  PoolCreatedCreatorId = 'poolCreated__creatorId',
  PoolCreatedCreatorName = 'poolCreated__creatorName',
  PoolCreatedDecisionDate = 'poolCreated__decisionDate',
  PoolCreatedId = 'poolCreated__id',
  PoolCreatedImageUrl = 'poolCreated__imageUrl',
  PoolCreatedPoolId = 'poolCreated__poolId',
  PoolCreatedQuestion = 'poolCreated__question',
  PoolCreatedTransactionHash = 'poolCreated__transactionHash',
  PoolId = 'poolId',
  TransactionHash = 'transactionHash',
  User = 'user'
}

export type Bet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Bet_Filter>>>;
  betIntId?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betIntId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_not?: InputMaybe<Scalars['BigInt']['input']>;
  betIntId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  optionIndex?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optionIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  optionIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Bet_Filter>>>;
  payoutClaimed?: InputMaybe<Scalars['Boolean']['input']>;
  payoutClaimedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payoutClaimedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payoutClaimedBlockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payoutClaimedBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  payoutClaimedBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payoutClaimedTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  payoutClaimedTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  payoutClaimedTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  payoutClaimed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  payoutClaimed_not?: InputMaybe<Scalars['Boolean']['input']>;
  payoutClaimed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolIdHex?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_gt?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_gte?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolIdHex_lt?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_lte?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolIntId?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolIntId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Bet_OrderBy {
  Amount = 'amount',
  BetIntId = 'betIntId',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  ChainName = 'chainName',
  CreatedAt = 'createdAt',
  Id = 'id',
  OptionIndex = 'optionIndex',
  PayoutClaimed = 'payoutClaimed',
  PayoutClaimedBlockNumber = 'payoutClaimedBlockNumber',
  PayoutClaimedBlockTimestamp = 'payoutClaimedBlockTimestamp',
  PayoutClaimedTransactionHash = 'payoutClaimedTransactionHash',
  Pool = 'pool',
  PoolIdHex = 'poolIdHex',
  PoolIntId = 'poolIntId',
  PoolBetsCloseAt = 'pool__betsCloseAt',
  PoolCategory = 'pool__category',
  PoolChainId = 'pool__chainId',
  PoolChainName = 'pool__chainName',
  PoolClosureCriteria = 'pool__closureCriteria',
  PoolClosureInstructions = 'pool__closureInstructions',
  PoolCreatedBlockNumber = 'pool__createdBlockNumber',
  PoolCreatedBlockTimestamp = 'pool__createdBlockTimestamp',
  PoolCreatedTransactionHash = 'pool__createdTransactionHash',
  PoolCreatorId = 'pool__creatorId',
  PoolCreatorName = 'pool__creatorName',
  PoolDecisionDate = 'pool__decisionDate',
  PoolGradedBlockNumber = 'pool__gradedBlockNumber',
  PoolGradedBlockTimestamp = 'pool__gradedBlockTimestamp',
  PoolGradedTransactionHash = 'pool__gradedTransactionHash',
  PoolId = 'pool__id',
  PoolImageUrl = 'pool__imageUrl',
  PoolIsDraw = 'pool__isDraw',
  PoolLastUpdatedBlockNumber = 'pool__lastUpdatedBlockNumber',
  PoolLastUpdatedBlockTimestamp = 'pool__lastUpdatedBlockTimestamp',
  PoolLastUpdatedTransactionHash = 'pool__lastUpdatedTransactionHash',
  PoolPoolIntId = 'pool__poolIntId',
  PoolQuestion = 'pool__question',
  PoolSelectedOption = 'pool__selectedOption',
  PoolStatus = 'pool__status',
  PoolTotalBets = 'pool__totalBets',
  PoolXPostId = 'pool__xPostId',
  TransactionHash = 'transactionHash',
  UpdatedAt = 'updatedAt',
  User = 'user'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PayoutClaimed = {
  __typename?: 'PayoutClaimed';
  amount: Scalars['BigInt']['output'];
  bet: Bet;
  betId: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  id: Scalars['Bytes']['output'];
  pool: Pool;
  poolId: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  user: Scalars['Bytes']['output'];
};

export type PayoutClaimed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PayoutClaimed_Filter>>>;
  bet?: InputMaybe<Scalars['String']['input']>;
  betId?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not?: InputMaybe<Scalars['BigInt']['input']>;
  betId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bet_?: InputMaybe<Bet_Filter>;
  bet_contains?: InputMaybe<Scalars['String']['input']>;
  bet_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bet_ends_with?: InputMaybe<Scalars['String']['input']>;
  bet_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bet_gt?: InputMaybe<Scalars['String']['input']>;
  bet_gte?: InputMaybe<Scalars['String']['input']>;
  bet_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bet_lt?: InputMaybe<Scalars['String']['input']>;
  bet_lte?: InputMaybe<Scalars['String']['input']>;
  bet_not?: InputMaybe<Scalars['String']['input']>;
  bet_not_contains?: InputMaybe<Scalars['String']['input']>;
  bet_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bet_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bet_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bet_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bet_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bet_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bet_starts_with?: InputMaybe<Scalars['String']['input']>;
  bet_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PayoutClaimed_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolId?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PayoutClaimed_OrderBy {
  Amount = 'amount',
  Bet = 'bet',
  BetId = 'betId',
  BetAmount = 'bet__amount',
  BetBetIntId = 'bet__betIntId',
  BetBlockNumber = 'bet__blockNumber',
  BetBlockTimestamp = 'bet__blockTimestamp',
  BetChainId = 'bet__chainId',
  BetChainName = 'bet__chainName',
  BetCreatedAt = 'bet__createdAt',
  BetOptionIndex = 'bet__optionIndex',
  BetPayoutClaimed = 'bet__payoutClaimed',
  BetPayoutClaimedBlockNumber = 'bet__payoutClaimedBlockNumber',
  BetPayoutClaimedBlockTimestamp = 'bet__payoutClaimedBlockTimestamp',
  BetPayoutClaimedTransactionHash = 'bet__payoutClaimedTransactionHash',
  BetPoolIdHex = 'bet__poolIdHex',
  BetPoolIntId = 'bet__poolIntId',
  BetTransactionHash = 'bet__transactionHash',
  BetUpdatedAt = 'bet__updatedAt',
  BetUser = 'bet__user',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  ChainName = 'chainName',
  Id = 'id',
  Pool = 'pool',
  PoolBetsCloseAt = 'pool__betsCloseAt',
  PoolCategory = 'pool__category',
  PoolChainId = 'pool__chainId',
  PoolChainName = 'pool__chainName',
  PoolClosureCriteria = 'pool__closureCriteria',
  PoolClosureInstructions = 'pool__closureInstructions',
  PoolCreatedBlockNumber = 'pool__createdBlockNumber',
  PoolCreatedBlockTimestamp = 'pool__createdBlockTimestamp',
  PoolCreatedTransactionHash = 'pool__createdTransactionHash',
  PoolCreatorId = 'pool__creatorId',
  PoolCreatorName = 'pool__creatorName',
  PoolDecisionDate = 'pool__decisionDate',
  PoolGradedBlockNumber = 'pool__gradedBlockNumber',
  PoolGradedBlockTimestamp = 'pool__gradedBlockTimestamp',
  PoolGradedTransactionHash = 'pool__gradedTransactionHash',
  PoolId = 'pool__id',
  PoolImageUrl = 'pool__imageUrl',
  PoolIsDraw = 'pool__isDraw',
  PoolLastUpdatedBlockNumber = 'pool__lastUpdatedBlockNumber',
  PoolLastUpdatedBlockTimestamp = 'pool__lastUpdatedBlockTimestamp',
  PoolLastUpdatedTransactionHash = 'pool__lastUpdatedTransactionHash',
  PoolPoolIntId = 'pool__poolIntId',
  PoolQuestion = 'pool__question',
  PoolSelectedOption = 'pool__selectedOption',
  PoolStatus = 'pool__status',
  PoolTotalBets = 'pool__totalBets',
  PoolXPostId = 'pool__xPostId',
  TransactionHash = 'transactionHash',
  User = 'user'
}

export type Pool = {
  __typename?: 'Pool';
  bets: Array<Bet>;
  betsCloseAt: Scalars['BigInt']['output'];
  category: Scalars['String']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  closureCriteria: Scalars['String']['output'];
  closureInstructions: Scalars['String']['output'];
  createdBlockNumber: Scalars['BigInt']['output'];
  createdBlockTimestamp: Scalars['BigInt']['output'];
  createdTransactionHash: Scalars['Bytes']['output'];
  creatorId: Scalars['String']['output'];
  creatorName: Scalars['String']['output'];
  decisionDate: Scalars['BigInt']['output'];
  gradedBlockNumber: Scalars['BigInt']['output'];
  gradedBlockTimestamp: Scalars['BigInt']['output'];
  gradedTransactionHash: Scalars['Bytes']['output'];
  id: Scalars['Bytes']['output'];
  imageUrl: Scalars['String']['output'];
  isDraw: Scalars['Boolean']['output'];
  lastUpdatedBlockNumber: Scalars['BigInt']['output'];
  lastUpdatedBlockTimestamp: Scalars['BigInt']['output'];
  lastUpdatedTransactionHash: Scalars['Bytes']['output'];
  options: Array<Scalars['String']['output']>;
  poolIntId: Scalars['BigInt']['output'];
  question: Scalars['String']['output'];
  selectedOption: Scalars['BigInt']['output'];
  status: PoolStatus;
  totalBets: Scalars['BigInt']['output'];
  totalBetsByOption: Array<Scalars['BigInt']['output']>;
  xPostId: Scalars['String']['output'];
};


export type PoolBetsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Bet_Filter>;
};

export type PoolClosed = {
  __typename?: 'PoolClosed';
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  id: Scalars['Bytes']['output'];
  poolId: Scalars['BigInt']['output'];
  selectedOption: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type PoolClosed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolClosed_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolClosed_Filter>>>;
  poolId?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  selectedOption?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_gt?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_gte?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  selectedOption_lt?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_lte?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_not?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PoolClosed_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChainId = 'chainId',
  ChainName = 'chainName',
  Id = 'id',
  PoolId = 'poolId',
  SelectedOption = 'selectedOption',
  TransactionHash = 'transactionHash'
}

export type PoolCreated = {
  __typename?: 'PoolCreated';
  betsCloseAt: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  category: Scalars['String']['output'];
  chainId: Scalars['BigInt']['output'];
  chainName: Scalars['String']['output'];
  closureCriteria: Scalars['String']['output'];
  closureInstructions: Scalars['String']['output'];
  creatorId: Scalars['String']['output'];
  creatorName: Scalars['String']['output'];
  decisionDate: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  imageUrl: Scalars['String']['output'];
  options: Array<Scalars['String']['output']>;
  poolId: Scalars['BigInt']['output'];
  question: Scalars['String']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type PoolCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolCreated_Filter>>>;
  betsCloseAt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betsCloseAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  category?: InputMaybe<Scalars['String']['input']>;
  category_contains?: InputMaybe<Scalars['String']['input']>;
  category_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  category_ends_with?: InputMaybe<Scalars['String']['input']>;
  category_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_gt?: InputMaybe<Scalars['String']['input']>;
  category_gte?: InputMaybe<Scalars['String']['input']>;
  category_in?: InputMaybe<Array<Scalars['String']['input']>>;
  category_lt?: InputMaybe<Scalars['String']['input']>;
  category_lte?: InputMaybe<Scalars['String']['input']>;
  category_not?: InputMaybe<Scalars['String']['input']>;
  category_not_contains?: InputMaybe<Scalars['String']['input']>;
  category_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  category_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  category_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  category_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  category_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_starts_with?: InputMaybe<Scalars['String']['input']>;
  category_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_contains?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_gt?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_gte?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureCriteria_lt?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_lte?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_contains?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureCriteria_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_contains?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_gt?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_gte?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureInstructions_lt?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_lte?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_contains?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureInstructions_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId?: InputMaybe<Scalars['String']['input']>;
  creatorId_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_gt?: InputMaybe<Scalars['String']['input']>;
  creatorId_gte?: InputMaybe<Scalars['String']['input']>;
  creatorId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorId_lt?: InputMaybe<Scalars['String']['input']>;
  creatorId_lte?: InputMaybe<Scalars['String']['input']>;
  creatorId_not?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName?: InputMaybe<Scalars['String']['input']>;
  creatorName_contains?: InputMaybe<Scalars['String']['input']>;
  creatorName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_gt?: InputMaybe<Scalars['String']['input']>;
  creatorName_gte?: InputMaybe<Scalars['String']['input']>;
  creatorName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorName_lt?: InputMaybe<Scalars['String']['input']>;
  creatorName_lte?: InputMaybe<Scalars['String']['input']>;
  creatorName_not?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decisionDate?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decisionDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl_contains?: InputMaybe<Scalars['String']['input']>;
  imageUrl_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_gt?: InputMaybe<Scalars['String']['input']>;
  imageUrl_gte?: InputMaybe<Scalars['String']['input']>;
  imageUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl_lt?: InputMaybe<Scalars['String']['input']>;
  imageUrl_lte?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  options_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  options_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolCreated_Filter>>>;
  poolId?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  question?: InputMaybe<Scalars['String']['input']>;
  question_contains?: InputMaybe<Scalars['String']['input']>;
  question_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  question_ends_with?: InputMaybe<Scalars['String']['input']>;
  question_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_gt?: InputMaybe<Scalars['String']['input']>;
  question_gte?: InputMaybe<Scalars['String']['input']>;
  question_in?: InputMaybe<Array<Scalars['String']['input']>>;
  question_lt?: InputMaybe<Scalars['String']['input']>;
  question_lte?: InputMaybe<Scalars['String']['input']>;
  question_not?: InputMaybe<Scalars['String']['input']>;
  question_not_contains?: InputMaybe<Scalars['String']['input']>;
  question_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  question_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  question_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  question_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  question_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_starts_with?: InputMaybe<Scalars['String']['input']>;
  question_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PoolCreated_OrderBy {
  BetsCloseAt = 'betsCloseAt',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Category = 'category',
  ChainId = 'chainId',
  ChainName = 'chainName',
  ClosureCriteria = 'closureCriteria',
  ClosureInstructions = 'closureInstructions',
  CreatorId = 'creatorId',
  CreatorName = 'creatorName',
  DecisionDate = 'decisionDate',
  Id = 'id',
  ImageUrl = 'imageUrl',
  Options = 'options',
  PoolId = 'poolId',
  Question = 'question',
  TransactionHash = 'transactionHash'
}

export enum PoolStatus {
  Graded = 'GRADED',
  Pending = 'PENDING'
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  betsCloseAt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  betsCloseAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  betsCloseAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bets_?: InputMaybe<Bet_Filter>;
  category?: InputMaybe<Scalars['String']['input']>;
  category_contains?: InputMaybe<Scalars['String']['input']>;
  category_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  category_ends_with?: InputMaybe<Scalars['String']['input']>;
  category_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_gt?: InputMaybe<Scalars['String']['input']>;
  category_gte?: InputMaybe<Scalars['String']['input']>;
  category_in?: InputMaybe<Array<Scalars['String']['input']>>;
  category_lt?: InputMaybe<Scalars['String']['input']>;
  category_lte?: InputMaybe<Scalars['String']['input']>;
  category_not?: InputMaybe<Scalars['String']['input']>;
  category_not_contains?: InputMaybe<Scalars['String']['input']>;
  category_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  category_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  category_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  category_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  category_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  category_starts_with?: InputMaybe<Scalars['String']['input']>;
  category_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  chainName_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_gt?: InputMaybe<Scalars['String']['input']>;
  chainName_gte?: InputMaybe<Scalars['String']['input']>;
  chainName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_lt?: InputMaybe<Scalars['String']['input']>;
  chainName_lte?: InputMaybe<Scalars['String']['input']>;
  chainName_not?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains?: InputMaybe<Scalars['String']['input']>;
  chainName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chainName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_contains?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_gt?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_gte?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureCriteria_lt?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_lte?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_contains?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureCriteria_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureCriteria_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_contains?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_gt?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_gte?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureInstructions_lt?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_lte?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_contains?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closureInstructions_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_starts_with?: InputMaybe<Scalars['String']['input']>;
  closureInstructions_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  createdTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creatorId?: InputMaybe<Scalars['String']['input']>;
  creatorId_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_gt?: InputMaybe<Scalars['String']['input']>;
  creatorId_gte?: InputMaybe<Scalars['String']['input']>;
  creatorId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorId_lt?: InputMaybe<Scalars['String']['input']>;
  creatorId_lte?: InputMaybe<Scalars['String']['input']>;
  creatorId_not?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName?: InputMaybe<Scalars['String']['input']>;
  creatorName_contains?: InputMaybe<Scalars['String']['input']>;
  creatorName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_gt?: InputMaybe<Scalars['String']['input']>;
  creatorName_gte?: InputMaybe<Scalars['String']['input']>;
  creatorName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorName_lt?: InputMaybe<Scalars['String']['input']>;
  creatorName_lte?: InputMaybe<Scalars['String']['input']>;
  creatorName_not?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creatorName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creatorName_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decisionDate?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decisionDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  decisionDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gradedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gradedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gradedBlockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gradedBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  gradedBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gradedTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gradedTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  gradedTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl_contains?: InputMaybe<Scalars['String']['input']>;
  imageUrl_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_gt?: InputMaybe<Scalars['String']['input']>;
  imageUrl_gte?: InputMaybe<Scalars['String']['input']>;
  imageUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl_lt?: InputMaybe<Scalars['String']['input']>;
  imageUrl_lte?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageUrl_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageUrl_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageUrl_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  isDraw?: InputMaybe<Scalars['Boolean']['input']>;
  isDraw_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDraw_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDraw_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  lastUpdatedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedBlockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastUpdatedTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  lastUpdatedTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  options_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  options_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  options_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  poolIntId?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolIntId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  question?: InputMaybe<Scalars['String']['input']>;
  question_contains?: InputMaybe<Scalars['String']['input']>;
  question_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  question_ends_with?: InputMaybe<Scalars['String']['input']>;
  question_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_gt?: InputMaybe<Scalars['String']['input']>;
  question_gte?: InputMaybe<Scalars['String']['input']>;
  question_in?: InputMaybe<Array<Scalars['String']['input']>>;
  question_lt?: InputMaybe<Scalars['String']['input']>;
  question_lte?: InputMaybe<Scalars['String']['input']>;
  question_not?: InputMaybe<Scalars['String']['input']>;
  question_not_contains?: InputMaybe<Scalars['String']['input']>;
  question_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  question_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  question_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  question_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  question_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  question_starts_with?: InputMaybe<Scalars['String']['input']>;
  question_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selectedOption?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_gt?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_gte?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  selectedOption_lt?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_lte?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_not?: InputMaybe<Scalars['BigInt']['input']>;
  selectedOption_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<PoolStatus>;
  status_in?: InputMaybe<Array<PoolStatus>>;
  status_not?: InputMaybe<PoolStatus>;
  status_not_in?: InputMaybe<Array<PoolStatus>>;
  totalBets?: InputMaybe<Scalars['BigInt']['input']>;
  totalBetsByOption?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBetsByOption_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBetsByOption_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBetsByOption_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBetsByOption_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBetsByOption_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBets_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBets_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBets_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  xPostId?: InputMaybe<Scalars['String']['input']>;
  xPostId_contains?: InputMaybe<Scalars['String']['input']>;
  xPostId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_ends_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_gt?: InputMaybe<Scalars['String']['input']>;
  xPostId_gte?: InputMaybe<Scalars['String']['input']>;
  xPostId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xPostId_lt?: InputMaybe<Scalars['String']['input']>;
  xPostId_lte?: InputMaybe<Scalars['String']['input']>;
  xPostId_not?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_contains?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xPostId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_starts_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Pool_OrderBy {
  Bets = 'bets',
  BetsCloseAt = 'betsCloseAt',
  Category = 'category',
  ChainId = 'chainId',
  ChainName = 'chainName',
  ClosureCriteria = 'closureCriteria',
  ClosureInstructions = 'closureInstructions',
  CreatedBlockNumber = 'createdBlockNumber',
  CreatedBlockTimestamp = 'createdBlockTimestamp',
  CreatedTransactionHash = 'createdTransactionHash',
  CreatorId = 'creatorId',
  CreatorName = 'creatorName',
  DecisionDate = 'decisionDate',
  GradedBlockNumber = 'gradedBlockNumber',
  GradedBlockTimestamp = 'gradedBlockTimestamp',
  GradedTransactionHash = 'gradedTransactionHash',
  Id = 'id',
  ImageUrl = 'imageUrl',
  IsDraw = 'isDraw',
  LastUpdatedBlockNumber = 'lastUpdatedBlockNumber',
  LastUpdatedBlockTimestamp = 'lastUpdatedBlockTimestamp',
  LastUpdatedTransactionHash = 'lastUpdatedTransactionHash',
  Options = 'options',
  PoolIntId = 'poolIntId',
  Question = 'question',
  SelectedOption = 'selectedOption',
  Status = 'status',
  TotalBets = 'totalBets',
  TotalBetsByOption = 'totalBetsByOption',
  XPostId = 'xPostId'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bet?: Maybe<Bet>;
  betCancelled?: Maybe<BetCancelled>;
  betCancelleds: Array<BetCancelled>;
  betPlaced?: Maybe<BetPlaced>;
  betPlaceds: Array<BetPlaced>;
  bets: Array<Bet>;
  payoutClaimed?: Maybe<PayoutClaimed>;
  payoutClaimeds: Array<PayoutClaimed>;
  pool?: Maybe<Pool>;
  poolClosed?: Maybe<PoolClosed>;
  poolCloseds: Array<PoolClosed>;
  poolCreated?: Maybe<PoolCreated>;
  poolCreateds: Array<PoolCreated>;
  pools: Array<Pool>;
  twitterPostIdSet?: Maybe<TwitterPostIdSet>;
  twitterPostIdSets: Array<TwitterPostIdSet>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBetCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBetCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BetCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BetCancelled_Filter>;
};


export type QueryBetPlacedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBetPlacedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BetPlaced_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BetPlaced_Filter>;
};


export type QueryBetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bet_Filter>;
};


export type QueryPayoutClaimedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPayoutClaimedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PayoutClaimed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayoutClaimed_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolClosed_Filter>;
};


export type QueryPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolCreated_Filter>;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QueryTwitterPostIdSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTwitterPostIdSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TwitterPostIdSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TwitterPostIdSet_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bet?: Maybe<Bet>;
  betCancelled?: Maybe<BetCancelled>;
  betCancelleds: Array<BetCancelled>;
  betPlaced?: Maybe<BetPlaced>;
  betPlaceds: Array<BetPlaced>;
  bets: Array<Bet>;
  payoutClaimed?: Maybe<PayoutClaimed>;
  payoutClaimeds: Array<PayoutClaimed>;
  pool?: Maybe<Pool>;
  poolClosed?: Maybe<PoolClosed>;
  poolCloseds: Array<PoolClosed>;
  poolCreated?: Maybe<PoolCreated>;
  poolCreateds: Array<PoolCreated>;
  pools: Array<Pool>;
  twitterPostIdSet?: Maybe<TwitterPostIdSet>;
  twitterPostIdSets: Array<TwitterPostIdSet>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBetCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBetCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BetCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BetCancelled_Filter>;
};


export type SubscriptionBetPlacedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBetPlacedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BetPlaced_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BetPlaced_Filter>;
};


export type SubscriptionBetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bet_Filter>;
};


export type SubscriptionPayoutClaimedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPayoutClaimedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PayoutClaimed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayoutClaimed_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolClosedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolClosedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolClosed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolClosed_Filter>;
};


export type SubscriptionPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolCreated_Filter>;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionTwitterPostIdSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTwitterPostIdSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TwitterPostIdSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TwitterPostIdSet_Filter>;
};

export type TwitterPostIdSet = {
  __typename?: 'TwitterPostIdSet';
  id: Scalars['Bytes']['output'];
  pool: Pool;
  poolIdHex: Scalars['Bytes']['output'];
  poolIntId: Scalars['BigInt']['output'];
  xPostId: Scalars['String']['output'];
};

export type TwitterPostIdSet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TwitterPostIdSet_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TwitterPostIdSet_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolIdHex?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_gt?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_gte?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolIdHex_lt?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_lte?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolIdHex_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolIntId?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolIntId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolIntId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId?: InputMaybe<Scalars['String']['input']>;
  xPostId_contains?: InputMaybe<Scalars['String']['input']>;
  xPostId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_ends_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_gt?: InputMaybe<Scalars['String']['input']>;
  xPostId_gte?: InputMaybe<Scalars['String']['input']>;
  xPostId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xPostId_lt?: InputMaybe<Scalars['String']['input']>;
  xPostId_lte?: InputMaybe<Scalars['String']['input']>;
  xPostId_not?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_contains?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xPostId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xPostId_starts_with?: InputMaybe<Scalars['String']['input']>;
  xPostId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TwitterPostIdSet_OrderBy {
  Id = 'id',
  Pool = 'pool',
  PoolIdHex = 'poolIdHex',
  PoolIntId = 'poolIntId',
  PoolBetsCloseAt = 'pool__betsCloseAt',
  PoolCategory = 'pool__category',
  PoolChainId = 'pool__chainId',
  PoolChainName = 'pool__chainName',
  PoolClosureCriteria = 'pool__closureCriteria',
  PoolClosureInstructions = 'pool__closureInstructions',
  PoolCreatedBlockNumber = 'pool__createdBlockNumber',
  PoolCreatedBlockTimestamp = 'pool__createdBlockTimestamp',
  PoolCreatedTransactionHash = 'pool__createdTransactionHash',
  PoolCreatorId = 'pool__creatorId',
  PoolCreatorName = 'pool__creatorName',
  PoolDecisionDate = 'pool__decisionDate',
  PoolGradedBlockNumber = 'pool__gradedBlockNumber',
  PoolGradedBlockTimestamp = 'pool__gradedBlockTimestamp',
  PoolGradedTransactionHash = 'pool__gradedTransactionHash',
  PoolId = 'pool__id',
  PoolImageUrl = 'pool__imageUrl',
  PoolIsDraw = 'pool__isDraw',
  PoolLastUpdatedBlockNumber = 'pool__lastUpdatedBlockNumber',
  PoolLastUpdatedBlockTimestamp = 'pool__lastUpdatedBlockTimestamp',
  PoolLastUpdatedTransactionHash = 'pool__lastUpdatedTransactionHash',
  PoolPoolIntId = 'pool__poolIntId',
  PoolQuestion = 'pool__question',
  PoolSelectedOption = 'pool__selectedOption',
  PoolStatus = 'pool__status',
  PoolTotalBets = 'pool__totalBets',
  PoolXPostId = 'pool__xPostId',
  XPostId = 'xPostId'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetPoolsQueryVariables = Exact<{
  filter: Pool_Filter;
  orderBy: Pool_OrderBy;
  orderDirection: OrderDirection;
}>;


export type GetPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: any, poolIntId: any, question: string, options: Array<string>, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, imageUrl: string, category: string, xPostId: string, creatorName: string, creatorId: string, closureCriteria: string, closureInstructions: string, betsCloseAt: any, decisionDate: any, chainId: any, chainName: string, isDraw: boolean, createdBlockNumber: any, createdBlockTimestamp: any, createdTransactionHash: any, lastUpdatedBlockNumber: any, lastUpdatedBlockTimestamp: any, lastUpdatedTransactionHash: any, gradedBlockNumber: any, gradedBlockTimestamp: any, gradedTransactionHash: any }> };

export type GetPoolsSubscriptionSubscriptionVariables = Exact<{
  filter: Pool_Filter;
}>;


export type GetPoolsSubscriptionSubscription = { __typename?: 'Subscription', pools: Array<{ __typename?: 'Pool', id: any, poolIntId: any, question: string, options: Array<string>, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, imageUrl: string, category: string, xPostId: string, creatorName: string, creatorId: string, closureCriteria: string, closureInstructions: string, betsCloseAt: any, decisionDate: any, chainId: any, chainName: string, isDraw: boolean, createdBlockNumber: any, createdBlockTimestamp: any, createdTransactionHash: any, lastUpdatedBlockNumber: any, lastUpdatedBlockTimestamp: any, lastUpdatedTransactionHash: any, gradedBlockNumber: any, gradedBlockTimestamp: any, gradedTransactionHash: any }> };

export type GetBetsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  filter: Bet_Filter;
  orderBy: Bet_OrderBy;
  orderDirection: OrderDirection;
}>;


export type GetBetsQuery = { __typename?: 'Query', bets: Array<{ __typename?: 'Bet', id: any, betIntId: any, optionIndex: any, amount: any, user: any, poolIntId: any, blockNumber: any, blockTimestamp: any, transactionHash: any, pool: { __typename?: 'Pool', id: any, poolIntId: any, question: string, options: Array<string>, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, decisionDate: any, betsCloseAt: any, creatorId: string, creatorName: string, imageUrl: string, chainId: any, chainName: string, isDraw: boolean, xPostId: string } }> };

export type GetBetsSubscriptionSubscriptionVariables = Exact<{
  filter: Bet_Filter;
}>;


export type GetBetsSubscriptionSubscription = { __typename?: 'Subscription', bets: Array<{ __typename?: 'Bet', id: any, betIntId: any, optionIndex: any, amount: any, user: any, poolIntId: any, blockNumber: any, blockTimestamp: any, transactionHash: any, pool: { __typename?: 'Pool', id: any, poolIntId: any, question: string, options: Array<string>, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, decisionDate: any, betsCloseAt: any, creatorId: string, creatorName: string, imageUrl: string, chainId: any, chainName: string, isDraw: boolean, xPostId: string } }> };

export type GetPoolQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type GetPoolQuery = { __typename?: 'Query', pool?: { __typename?: 'Pool', id: any, poolIntId: any, imageUrl: string, creatorName: string, creatorId: string, question: string, options: Array<string>, betsCloseAt: any, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, chainId: any, chainName: string, xPostId: string, isDraw: boolean } | null };

export type GetPoolSubscriptionSubscriptionVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type GetPoolSubscriptionSubscription = { __typename?: 'Subscription', pool?: { __typename?: 'Pool', id: any, poolIntId: any, imageUrl: string, creatorName: string, creatorId: string, question: string, options: Array<string>, betsCloseAt: any, totalBets: any, totalBetsByOption: Array<any>, selectedOption: any, status: PoolStatus, chainId: any, chainName: string, xPostId: string, isDraw: boolean } | null };


export const GetPoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Pool_filter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Pool_orderBy"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"closureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"closureInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"decisionDate"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"gradedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gradedBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"gradedTransactionHash"}}]}}]}}]} as unknown as DocumentNode<GetPoolsQuery, GetPoolsQueryVariables>;
export const GetPoolsSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GetPoolsSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Pool_filter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"closureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"closureInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"decisionDate"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"createdTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"gradedBlockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gradedBlockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"gradedTransactionHash"}}]}}]}}]} as unknown as DocumentNode<GetPoolsSubscriptionSubscription, GetPoolsSubscriptionSubscriptionVariables>;
export const GetBetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bet_filter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bet_orderBy"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"betIntId"}},{"kind":"Field","name":{"kind":"Name","value":"optionIndex"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"blockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"decisionDate"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}}]}}]}}]}}]} as unknown as DocumentNode<GetBetsQuery, GetBetsQueryVariables>;
export const GetBetsSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GetBetsSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bet_filter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"betIntId"}},{"kind":"Field","name":{"kind":"Name","value":"optionIndex"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"blockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"decisionDate"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}}]}}]}}]}}]} as unknown as DocumentNode<GetBetsSubscriptionSubscription, GetBetsSubscriptionSubscriptionVariables>;
export const GetPoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}}]}}]}}]} as unknown as DocumentNode<GetPoolQuery, GetPoolQueryVariables>;
export const GetPoolSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GetPoolSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"poolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"poolIntId"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"betsCloseAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalBets"}},{"kind":"Field","name":{"kind":"Name","value":"totalBetsByOption"}},{"kind":"Field","name":{"kind":"Name","value":"selectedOption"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"chainName"}},{"kind":"Field","name":{"kind":"Name","value":"xPostId"}},{"kind":"Field","name":{"kind":"Name","value":"isDraw"}}]}}]}}]} as unknown as DocumentNode<GetPoolSubscriptionSubscription, GetPoolSubscriptionSubscriptionVariables>;