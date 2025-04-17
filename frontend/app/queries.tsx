'use client';

//TODO Created this file because the glob against stories for documents wasn't working and I wanted to keep up the pace
// Can move these to better places, just if you don't see graphql-codegen capture them, double and triple check the document glob in codegen.ts
import { gql } from '@/lib/__generated__/gql';

// Used in pools/page.tsx
export const GET_POOLS = gql(`
  query GetPools(
    $filter: Pool_filter!
    $orderBy: Pool_orderBy!
    $orderDirection: OrderDirection!
  ) {
    pools(
      where: $filter
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
        id
        poolIntId
        question
        options
        usdcVolume
        pointsVolume
        usdcBetTotalsByOption
        pointsBetTotalsByOption
        selectedOption
        status
        imageUrl
        category
        xPostId
        
        creatorName
        creatorId
        closureCriteria
        closureInstructions
        betsCloseAt
        decisionTime
        chainId
        chainName
        isDraw
        createdBlockNumber
        createdBlockTimestamp
        createdTransactionHash
        lastUpdatedBlockNumber
        lastUpdatedBlockTimestamp
        lastUpdatedTransactionHash
        gradedBlockNumber
        gradedBlockTimestamp
        gradedTransactionHash
    }
  }
`);

// Used in BetList.tsx
export const GET_BETS = gql(`
  query GetBets(
    $first: Int = 10
    $filter: Bet_filter!
    $orderBy: Bet_orderBy!
    $orderDirection: OrderDirection!
  ) {
    bets(
      first: $first
      where: $filter
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      betIntId
      optionIndex
      amount
      userAddress
      poolIntId
      blockNumber
      blockTimestamp
      transactionHash
      pool {
             id
      poolIntId
      question
      options
      usdcVolume
      pointsVolume
      usdcBetTotalsByOption
      pointsBetTotalsByOption
      selectedOption
      status
      decisionTime
      betsCloseAt
      creatorId
      creatorName
      imageUrl
      chainId
      chainName
      isDraw
      xPostId
      }
    }
  }
`);

export const GET_POOL = gql(`
  query GetPool($poolId: ID!) {
    pool( id: $poolId ) {
      id
      poolIntId
      imageUrl
      creatorName
      creatorId
      question
      options
      betsCloseAt
      usdcVolume
      pointsVolume
      usdcBetTotalsByOption
      pointsBetTotalsByOption
      selectedOption
      status
      chainId
      chainName
      xPostId
      isDraw
    }
  }
`);
