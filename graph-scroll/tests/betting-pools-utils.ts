import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BetCancelled,
  BetPlaced,
  PoolClosed,
  PoolCreated
} from "../generated/BettingPools/BettingPools"

export function createBetCancelledEvent(
  betId: BigInt,
  poolId: BigInt,
  user: Address,
  optionIndex: BigInt,
  amount: BigInt
): BetCancelled {
  let betCancelledEvent = changetype<BetCancelled>(newMockEvent())

  betCancelledEvent.parameters = new Array()

  betCancelledEvent.parameters.push(
    new ethereum.EventParam("betId", ethereum.Value.fromUnsignedBigInt(betId))
  )
  betCancelledEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  betCancelledEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  betCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "optionIndex",
      ethereum.Value.fromUnsignedBigInt(optionIndex)
    )
  )
  betCancelledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return betCancelledEvent
}

export function createBetPlacedEvent(
  betId: BigInt,
  poolId: BigInt,
  user: Address,
  optionIndex: BigInt,
  amount: BigInt
): BetPlaced {
  let betPlacedEvent = changetype<BetPlaced>(newMockEvent())

  betPlacedEvent.parameters = new Array()

  betPlacedEvent.parameters.push(
    new ethereum.EventParam("betId", ethereum.Value.fromUnsignedBigInt(betId))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "optionIndex",
      ethereum.Value.fromUnsignedBigInt(optionIndex)
    )
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return betPlacedEvent
}

export function createPoolClosedEvent(
  poolId: BigInt,
  selectedOption: BigInt
): PoolClosed {
  let poolClosedEvent = changetype<PoolClosed>(newMockEvent())

  poolClosedEvent.parameters = new Array()

  poolClosedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolClosedEvent.parameters.push(
    new ethereum.EventParam(
      "selectedOption",
      ethereum.Value.fromUnsignedBigInt(selectedOption)
    )
  )

  return poolClosedEvent
}

export function createPoolCreatedEvent(
  poolId: BigInt,
  question: string,
  options: Array<string>,
  betsCloseAt: BigInt,
  decisionDate: BigInt
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromString(question))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("options", ethereum.Value.fromStringArray(options))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "betsCloseAt",
      ethereum.Value.fromUnsignedBigInt(betsCloseAt)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "decisionDate",
      ethereum.Value.fromUnsignedBigInt(decisionDate)
    )
  )

  return poolCreatedEvent
}
