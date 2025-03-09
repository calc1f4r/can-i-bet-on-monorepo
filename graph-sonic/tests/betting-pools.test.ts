import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BetCancelled } from "../generated/schema"
import { BetCancelled as BetCancelledEvent } from "../generated/BettingPools/BettingPools"
import { handleBetCancelled } from "../src/betting-pools"
import { createBetCancelledEvent } from "./betting-pools-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let betId = BigInt.fromI32(234)
    let poolId = BigInt.fromI32(234)
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let optionIndex = BigInt.fromI32(234)
    let amount = BigInt.fromI32(234)
    let newBetCancelledEvent = createBetCancelledEvent(
      betId,
      poolId,
      user,
      optionIndex,
      amount
    )
    handleBetCancelled(newBetCancelledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BetCancelled created and stored", () => {
    assert.entityCount("BetCancelled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BetCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "betId",
      "234"
    )
    assert.fieldEquals(
      "BetCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "234"
    )
    assert.fieldEquals(
      "BetCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BetCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "optionIndex",
      "234"
    )
    assert.fieldEquals(
      "BetCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
