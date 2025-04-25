pub mod betting_pools_state;
pub mod pool;
pub mod bet;

pub use betting_pools_state::*;
pub use pool::*;
pub use bet::*;

use anchor_lang::prelude::*;

// Add Event definitions if they are not already defined elsewhere
#[event]
pub struct PoolClosed {
    pub pool_id: u64,
    pub selected_option: u64,
    pub decision_time: i64,
    pub is_draw: bool,
    pub winning_option: u64,
}

#[event]
pub struct PayoutClaimed {
    pub bet_id: u64,
    pub pool_id: u64,
    pub user: Pubkey,
    pub amount: u64,
    pub outcome: BetOutcome,
    pub token_type: TokenType,
}