use anchor_lang::prelude::*;

// BettingPools state
#[account]
#[derive(InitSpace)]
pub struct BettingPoolsState {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub bet_points_mint: Pubkey,
    pub next_pool_id: u64,
    pub next_bet_id: u64,
    pub payout_fee_bp: u16,
    pub is_initialized: bool,
    pub bump: u8,
}