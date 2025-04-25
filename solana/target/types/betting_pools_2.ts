/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/betting_pools_2.json`.
 */
export type BettingPools2 = {
  "address": "E3V6czvYpjrdZVTLwFKzrw3GhCvH1LXKijADCkahw7QF",
  "metadata": {
    "name": "bettingPools2",
    "version": "0.1.1",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimPayout",
      "docs": [
        "Claim payout for a bet.",
        "Calls the handler in `instructions::claim_payout`."
      ],
      "discriminator": [
        127,
        240,
        132,
        62,
        227,
        198,
        146,
        133
      ],
      "accounts": [
        {
          "name": "bettingPools",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108,
                  115,
                  95,
                  118,
                  55
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  51
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "bet.id",
                "account": "bet"
              }
            ]
          }
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "bettorTokenAccount",
          "writable": true
        },
        {
          "name": "programTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "docs": [
        "Create a new betting pool.",
        "Calls the handler in `instructions::create_pool`."
      ],
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "bettingPools",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108,
                  115,
                  95,
                  118,
                  55
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  51
                ]
              },
              {
                "kind": "account",
                "path": "betting_pools.next_pool_id",
                "account": "bettingPoolsState"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "bettingPools"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "question",
          "type": "string"
        },
        {
          "name": "options",
          "type": {
            "array": [
              "string",
              2
            ]
          }
        },
        {
          "name": "betsCloseAt",
          "type": "i64"
        },
        {
          "name": "mediaUrl",
          "type": "string"
        },
        {
          "name": "mediaType",
          "type": {
            "defined": {
              "name": "mediaType"
            }
          }
        },
        {
          "name": "category",
          "type": "string"
        },
        {
          "name": "creatorName",
          "type": "string"
        },
        {
          "name": "creatorId",
          "type": "string"
        },
        {
          "name": "closureCriteria",
          "type": "string"
        },
        {
          "name": "closureInstructions",
          "type": "string"
        }
      ]
    },
    {
      "name": "gradeBet",
      "docs": [
        "Grade a betting pool.",
        "Calls the handler in `instructions::grade_bet`."
      ],
      "discriminator": [
        163,
        14,
        104,
        39,
        20,
        221,
        88,
        64
      ],
      "accounts": [
        {
          "name": "bettingPools",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108,
                  115,
                  95,
                  118,
                  55
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  51
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "bettingPools"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "responseOption",
          "type": "u64"
        },
        {
          "name": "decisionTimeOverride",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the BettingPools program.",
        "Calls the handler in `instructions::initialize`."
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "bettingPools",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108,
                  115,
                  95,
                  118,
                  55
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "usdcMint",
          "type": "pubkey"
        },
        {
          "name": "betPointsMint",
          "type": "pubkey"
        },
        {
          "name": "payoutFeeBp",
          "type": "u16"
        }
      ]
    },
    {
      "name": "placeBet",
      "docs": [
        "Place a bet on a pool.",
        "Calls the handler in `instructions::place_bet`."
      ],
      "discriminator": [
        222,
        62,
        67,
        220,
        63,
        166,
        126,
        33
      ],
      "accounts": [
        {
          "name": "bettingPools",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  116,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108,
                  115,
                  95,
                  118,
                  55
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  51
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "betting_pools.next_bet_id",
                "account": "bettingPoolsState"
              }
            ]
          }
        },
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "bettorTokenAccount",
          "writable": true
        },
        {
          "name": "programTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "optionIndex",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "tokenType",
          "type": {
            "defined": {
              "name": "tokenType"
            }
          }
        }
      ]
    },
    {
      "name": "setMedia",
      "docs": [
        "Update the media URL and type for a pool.",
        "Calls the handler in `instructions::set_media`."
      ],
      "discriminator": [
        10,
        60,
        163,
        255,
        4,
        75,
        82,
        109
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  51
                ]
              },
              {
                "kind": "account",
                "path": "pool.id",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "mediaUrl",
          "type": "string"
        },
        {
          "name": "mediaType",
          "type": {
            "defined": {
              "name": "mediaType"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "discriminator": [
        147,
        23,
        35,
        59,
        15,
        75,
        155,
        32
      ]
    },
    {
      "name": "bettingPoolsState",
      "discriminator": [
        136,
        14,
        114,
        28,
        173,
        213,
        192,
        14
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    }
  ],
  "events": [
    {
      "name": "betPlaced",
      "discriminator": [
        88,
        88,
        145,
        226,
        126,
        206,
        32,
        0
      ]
    },
    {
      "name": "payoutClaimed",
      "discriminator": [
        200,
        39,
        105,
        112,
        116,
        63,
        58,
        149
      ]
    },
    {
      "name": "poolClosed",
      "discriminator": [
        106,
        46,
        29,
        231,
        42,
        44,
        73,
        119
      ]
    },
    {
      "name": "poolCreated",
      "discriminator": [
        202,
        44,
        41,
        88,
        104,
        220,
        157,
        82
      ]
    },
    {
      "name": "poolMediaSet",
      "discriminator": [
        248,
        179,
        164,
        142,
        185,
        80,
        167,
        217
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "betsCloseTimeInPast",
      "msg": "Bets close time must be in the future"
    },
    {
      "code": 6001,
      "name": "betsCloseAfterDecision",
      "msg": "Bets close time must be before decision time"
    },
    {
      "code": 6002,
      "name": "poolNotOpen",
      "msg": "Pool is not open"
    },
    {
      "code": 6003,
      "name": "poolDoesntExist",
      "msg": "Pool doesn't exist"
    },
    {
      "code": 6004,
      "name": "bettingPeriodClosed",
      "msg": "Betting period is closed"
    },
    {
      "code": 6005,
      "name": "invalidOptionIndex",
      "msg": "Invalid option index"
    },
    {
      "code": 6006,
      "name": "betAlreadyExists",
      "msg": "Bet already exists"
    },
    {
      "code": 6007,
      "name": "alreadyInitialized",
      "msg": "BettingPools is already initialized"
    },
    {
      "code": 6008,
      "name": "zeroAmount",
      "msg": "Zero amount"
    },
    {
      "code": 6009,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6010,
      "name": "notAuthorized",
      "msg": "Not authorized"
    },
    {
      "code": 6011,
      "name": "tokenTransferFailed",
      "msg": "Token transfer failed"
    },
    {
      "code": 6012,
      "name": "poolNotGraded",
      "msg": "Pool is not graded yet"
    },
    {
      "code": 6013,
      "name": "betAlreadyPaidOut",
      "msg": "Bet has already been paid out"
    },
    {
      "code": 6014,
      "name": "notBetOwner",
      "msg": "Caller is not the owner of the bet"
    },
    {
      "code": 6015,
      "name": "incorrectTokenMint",
      "msg": "Incorrect token mint for provided token account"
    },
    {
      "code": 6016,
      "name": "gradingError",
      "msg": "Error during grading process"
    },
    {
      "code": 6017,
      "name": "payoutOverflow",
      "msg": "Calculated payout amount exceeds u64 max"
    },
    {
      "code": 6018,
      "name": "notInitialized",
      "msg": "BettingPools is not initialized"
    },
    {
      "code": 6019,
      "name": "invalidTokenAccountOwner",
      "msg": "Invalid token account owner"
    },
    {
      "code": 6020,
      "name": "betAmountTooLarge",
      "msg": "Bet amount exceeds maximum limit"
    },
    {
      "code": 6021,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    },
    {
      "code": 6022,
      "name": "poolAlreadyGraded",
      "msg": "Pool is already graded"
    },
    {
      "code": 6023,
      "name": "invalidProgramTokenAccount",
      "msg": "Invalid program token account"
    },
    {
      "code": 6024,
      "name": "divisionByZero",
      "msg": "Division by zero error"
    },
    {
      "code": 6025,
      "name": "zeroWinners",
      "msg": "Pool has zero winners"
    },
    {
      "code": 6026,
      "name": "tokenAccountMismatch",
      "msg": "Token account does not match bet token type"
    }
  ],
  "types": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "option",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "isPayedOut",
            "type": "bool"
          },
          {
            "name": "outcome",
            "type": {
              "defined": {
                "name": "betOutcome"
              }
            }
          },
          {
            "name": "tokenType",
            "type": {
              "defined": {
                "name": "tokenType"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "betOutcome",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "won"
          },
          {
            "name": "lost"
          },
          {
            "name": "voided"
          },
          {
            "name": "draw"
          }
        ]
      }
    },
    {
      "name": "betPlaced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "optionIndex",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tokenType",
            "type": {
              "defined": {
                "name": "tokenType"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bettingPoolsState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "usdcMint",
            "type": "pubkey"
          },
          {
            "name": "betPointsMint",
            "type": "pubkey"
          },
          {
            "name": "nextPoolId",
            "type": "u64"
          },
          {
            "name": "nextBetId",
            "type": "u64"
          },
          {
            "name": "payoutFeeBp",
            "type": "u16"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mediaType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "x"
          },
          {
            "name": "tikTok"
          },
          {
            "name": "instagram"
          },
          {
            "name": "facebook"
          },
          {
            "name": "image"
          },
          {
            "name": "video"
          },
          {
            "name": "externalLink"
          }
        ]
      }
    },
    {
      "name": "payoutClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "betId",
            "type": "u64"
          },
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "outcome",
            "type": {
              "defined": {
                "name": "betOutcome"
              }
            }
          },
          {
            "name": "tokenType",
            "type": {
              "defined": {
                "name": "tokenType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "question",
            "type": "string"
          },
          {
            "name": "options",
            "type": {
              "array": [
                "string",
                2
              ]
            }
          },
          {
            "name": "betsCloseAt",
            "type": "i64"
          },
          {
            "name": "decisionTime",
            "type": "i64"
          },
          {
            "name": "usdcBetTotals",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "pointsBetTotals",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "winningOption",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "poolStatus"
              }
            }
          },
          {
            "name": "isDraw",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "mediaUrl",
            "type": "string"
          },
          {
            "name": "mediaType",
            "type": {
              "defined": {
                "name": "mediaType"
              }
            }
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "creatorName",
            "type": "string"
          },
          {
            "name": "creatorId",
            "type": "string"
          },
          {
            "name": "closureCriteria",
            "type": "string"
          },
          {
            "name": "closureInstructions",
            "type": "string"
          },
          {
            "name": "twitterPostId",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "poolClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "selectedOption",
            "type": "u64"
          },
          {
            "name": "decisionTime",
            "type": "i64"
          },
          {
            "name": "isDraw",
            "type": "bool"
          },
          {
            "name": "winningOption",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "poolCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "question",
            "type": "string"
          },
          {
            "name": "options",
            "type": {
              "array": [
                "string",
                2
              ]
            }
          },
          {
            "name": "betsCloseAt",
            "type": "i64"
          },
          {
            "name": "mediaUrl",
            "type": "string"
          },
          {
            "name": "mediaType",
            "type": {
              "defined": {
                "name": "mediaType"
              }
            }
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "creatorName",
            "type": "string"
          },
          {
            "name": "creatorId",
            "type": "string"
          },
          {
            "name": "closureCriteria",
            "type": "string"
          },
          {
            "name": "closureInstructions",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "poolMediaSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u64"
          },
          {
            "name": "mediaUrl",
            "type": "string"
          },
          {
            "name": "mediaType",
            "type": {
              "defined": {
                "name": "mediaType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "poolStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "pending"
          },
          {
            "name": "graded"
          },
          {
            "name": "regraded"
          }
        ]
      }
    },
    {
      "name": "tokenType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "usdc"
          },
          {
            "name": "points"
          }
        ]
      }
    }
  ]
};
