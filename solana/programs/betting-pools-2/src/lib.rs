use anchor_lang::prelude::*;

// Declare modules
pub mod constants;
pub mod contexts;
pub mod errors;
pub mod instructions;
pub mod states;

// Re-export items for easier access
use instructions::*;
use states::{MediaType, TokenType}; // Import specific enums needed for function signatures

declare_id!("E3V6czvYpjrdZVTLwFKzrw3GhCvH1LXKijADCkahw7QF");

#[program]
pub mod betting_pools_2 {
    use super::*; 

    /// Initialize the BettingPools program.
    /// Calls the handler in `instructions::initialize`.
    pub fn initialize(
        ctx: Context<Initialize>,
        usdc_mint: Pubkey,
        bet_points_mint: Pubkey,
        payout_fee_bp: u16,
    ) -> Result<()> {
        initialize::initialize(ctx, usdc_mint, bet_points_mint, payout_fee_bp)
    }

    /// Create a new betting pool.
    /// Calls the handler in `instructions::create_pool`.
    pub fn create_pool(
        ctx: Context<CreatePool>,
        question: String,
        options: [String; 2],
        bets_close_at: i64,
        media_url: String,
        media_type: MediaType,
        category: String,
        creator_name: String,
        creator_id: String,
        closure_criteria: String,
        closure_instructions: String,
    ) -> Result<()> {
        create_pool::create_pool(
            ctx,
            question,
            options,
            bets_close_at,
            media_url,
            media_type,
            category,
            creator_name,
            creator_id,
            closure_criteria,
            closure_instructions,
        )
    }

    /// Place a bet on a pool.
    /// Calls the handler in `instructions::place_bet`.
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        option_index: u64,
        amount: u64,
        token_type: TokenType,
    ) -> Result<()> {
        place_bet::place_bet(ctx, option_index, amount, token_type)
    }

    /// Update the media URL and type for a pool.
    /// Calls the handler in `instructions::set_media`.
    pub fn set_media(
        ctx: Context<SetMedia>,
        media_url: String,
        media_type: MediaType,
    ) -> Result<()> {
        set_media::set_media(ctx, media_url, media_type)
    }

    /// Grade a betting pool.
    /// Calls the handler in `instructions::grade_bet`.
    pub fn grade_bet(
        ctx: Context<GradeBet>,
        response_option: u64,
        decision_time_override: Option<i64>,
    ) -> Result<()> {
        grade_bet::grade_bet(ctx, response_option, decision_time_override)
    }

    /// Claim payout for a bet.
    /// Calls the handler in `instructions::claim_payout`.
    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        claim_payout::claim_payout(ctx)
    }
}
