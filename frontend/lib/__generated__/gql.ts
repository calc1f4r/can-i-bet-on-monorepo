/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  query GetPools(\n    $filter: Pool_filter!\n    $orderBy: Pool_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    pools(\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n        id\n        poolIntId\n        question\n        options\n        usdcVolume\n        pointsVolume\n        usdcBetTotalsByOption\n        pointsBetTotalsByOption\n        selectedOption\n        status\n        imageUrl\n        category\n        xPostId\n        \n        creatorName\n        creatorId\n        closureCriteria\n        closureInstructions\n        betsCloseAt\n        decisionTime\n        chainId\n        chainName\n        isDraw\n        createdBlockNumber\n        createdBlockTimestamp\n        createdTransactionHash\n        lastUpdatedBlockNumber\n        lastUpdatedBlockTimestamp\n        lastUpdatedTransactionHash\n        gradedBlockNumber\n        gradedBlockTimestamp\n        gradedTransactionHash\n    }\n  }\n': typeof types.GetPoolsDocument;
  '\n  query GetBets(\n    $first: Int = 10\n    $filter: Bet_filter!\n    $orderBy: Bet_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    bets(\n      first: $first\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n      id\n      betIntId\n      optionIndex\n      amount\n      userAddress\n      poolIntId\n      blockNumber\n      blockTimestamp\n      transactionHash\n      pool {\n             id\n      poolIntId\n      question\n      options\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      decisionTime\n      betsCloseAt\n      creatorId\n      creatorName\n      imageUrl\n      chainId\n      chainName\n      isDraw\n      xPostId\n      }\n    }\n  }\n': typeof types.GetBetsDocument;
  '\n  query GetPool($poolId: ID!) {\n    pool( id: $poolId ) {\n      id\n      poolIntId\n      imageUrl\n      creatorName\n      creatorId\n      question\n      options\n      betsCloseAt\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      chainId\n      chainName\n      xPostId\n      isDraw\n    }\n  }\n': typeof types.GetPoolDocument;
};
const documents: Documents = {
  '\n  query GetPools(\n    $filter: Pool_filter!\n    $orderBy: Pool_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    pools(\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n        id\n        poolIntId\n        question\n        options\n        usdcVolume\n        pointsVolume\n        usdcBetTotalsByOption\n        pointsBetTotalsByOption\n        selectedOption\n        status\n        imageUrl\n        category\n        xPostId\n        \n        creatorName\n        creatorId\n        closureCriteria\n        closureInstructions\n        betsCloseAt\n        decisionTime\n        chainId\n        chainName\n        isDraw\n        createdBlockNumber\n        createdBlockTimestamp\n        createdTransactionHash\n        lastUpdatedBlockNumber\n        lastUpdatedBlockTimestamp\n        lastUpdatedTransactionHash\n        gradedBlockNumber\n        gradedBlockTimestamp\n        gradedTransactionHash\n    }\n  }\n':
    types.GetPoolsDocument,
  '\n  query GetBets(\n    $first: Int = 10\n    $filter: Bet_filter!\n    $orderBy: Bet_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    bets(\n      first: $first\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n      id\n      betIntId\n      optionIndex\n      amount\n      userAddress\n      poolIntId\n      blockNumber\n      blockTimestamp\n      transactionHash\n      pool {\n             id\n      poolIntId\n      question\n      options\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      decisionTime\n      betsCloseAt\n      creatorId\n      creatorName\n      imageUrl\n      chainId\n      chainName\n      isDraw\n      xPostId\n      }\n    }\n  }\n':
    types.GetBetsDocument,
  '\n  query GetPool($poolId: ID!) {\n    pool( id: $poolId ) {\n      id\n      poolIntId\n      imageUrl\n      creatorName\n      creatorId\n      question\n      options\n      betsCloseAt\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      chainId\n      chainName\n      xPostId\n      isDraw\n    }\n  }\n':
    types.GetPoolDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPools(\n    $filter: Pool_filter!\n    $orderBy: Pool_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    pools(\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n        id\n        poolIntId\n        question\n        options\n        usdcVolume\n        pointsVolume\n        usdcBetTotalsByOption\n        pointsBetTotalsByOption\n        selectedOption\n        status\n        imageUrl\n        category\n        xPostId\n        \n        creatorName\n        creatorId\n        closureCriteria\n        closureInstructions\n        betsCloseAt\n        decisionTime\n        chainId\n        chainName\n        isDraw\n        createdBlockNumber\n        createdBlockTimestamp\n        createdTransactionHash\n        lastUpdatedBlockNumber\n        lastUpdatedBlockTimestamp\n        lastUpdatedTransactionHash\n        gradedBlockNumber\n        gradedBlockTimestamp\n        gradedTransactionHash\n    }\n  }\n'
): (typeof documents)['\n  query GetPools(\n    $filter: Pool_filter!\n    $orderBy: Pool_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    pools(\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n        id\n        poolIntId\n        question\n        options\n        usdcVolume\n        pointsVolume\n        usdcBetTotalsByOption\n        pointsBetTotalsByOption\n        selectedOption\n        status\n        imageUrl\n        category\n        xPostId\n        \n        creatorName\n        creatorId\n        closureCriteria\n        closureInstructions\n        betsCloseAt\n        decisionTime\n        chainId\n        chainName\n        isDraw\n        createdBlockNumber\n        createdBlockTimestamp\n        createdTransactionHash\n        lastUpdatedBlockNumber\n        lastUpdatedBlockTimestamp\n        lastUpdatedTransactionHash\n        gradedBlockNumber\n        gradedBlockTimestamp\n        gradedTransactionHash\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetBets(\n    $first: Int = 10\n    $filter: Bet_filter!\n    $orderBy: Bet_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    bets(\n      first: $first\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n      id\n      betIntId\n      optionIndex\n      amount\n      userAddress\n      poolIntId\n      blockNumber\n      blockTimestamp\n      transactionHash\n      pool {\n             id\n      poolIntId\n      question\n      options\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      decisionTime\n      betsCloseAt\n      creatorId\n      creatorName\n      imageUrl\n      chainId\n      chainName\n      isDraw\n      xPostId\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetBets(\n    $first: Int = 10\n    $filter: Bet_filter!\n    $orderBy: Bet_orderBy!\n    $orderDirection: OrderDirection!\n  ) {\n    bets(\n      first: $first\n      where: $filter\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n    ) {\n      id\n      betIntId\n      optionIndex\n      amount\n      userAddress\n      poolIntId\n      blockNumber\n      blockTimestamp\n      transactionHash\n      pool {\n             id\n      poolIntId\n      question\n      options\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      decisionTime\n      betsCloseAt\n      creatorId\n      creatorName\n      imageUrl\n      chainId\n      chainName\n      isDraw\n      xPostId\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPool($poolId: ID!) {\n    pool( id: $poolId ) {\n      id\n      poolIntId\n      imageUrl\n      creatorName\n      creatorId\n      question\n      options\n      betsCloseAt\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      chainId\n      chainName\n      xPostId\n      isDraw\n    }\n  }\n'
): (typeof documents)['\n  query GetPool($poolId: ID!) {\n    pool( id: $poolId ) {\n      id\n      poolIntId\n      imageUrl\n      creatorName\n      creatorId\n      question\n      options\n      betsCloseAt\n      usdcVolume\n      pointsVolume\n      usdcBetTotalsByOption\n      pointsBetTotalsByOption\n      selectedOption\n      status\n      chainId\n      chainName\n      xPostId\n      isDraw\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
