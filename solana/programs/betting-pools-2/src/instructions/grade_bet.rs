use anchor_lang::prelude::*;
use crate::states::{BettingPoolsState, Pool, PoolStatus, PoolClosed};
use crate::errors::BettingPoolsError;
use crate::constants::{BETTING_POOLS_SEED, POOL_SEED};

// Grade bet context
#[derive(Accounts)]
#[instruction(response_option: u64)]
pub struct GradeBet<'info> {
    #[account(
        mut,
        seeds = [BETTING_POOLS_SEED],
        bump,
        has_one = authority @ BettingPoolsError::NotAuthorized
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        mut,
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Grade a betting pool
/// Determines the winning option and sets the decision time
pub fn grade_bet(
    ctx: Context<GradeBet>,
    response_option: u64,
    decision_time_override: Option<i64>, // Optional decision time override
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    // Check if pool is already graded
    if pool.status != PoolStatus::Pending {
        return err!(BettingPoolsError::PoolNotOpen); // Consider a more specific error like PoolAlreadyGraded
    }

    pool.status = PoolStatus::Graded;

    if response_option == 0 {
        pool.winning_option = 0;
        pool.is_draw = false;
    } else if response_option == 1 {
        pool.winning_option = 1;
        pool.is_draw = false;
    } else if response_option == 2 {
        pool.is_draw = true;
        // winning_option doesn't matter for a draw, keep default or set explicitly
        pool.winning_option = 0; // Or some other indicator if needed
    } else {
        return err!(BettingPoolsError::GradingError);
    }

    // Set decision time to current time unless overridden
    let clock = Clock::get()?;
    pool.decision_time = decision_time_override.unwrap_or(clock.unix_timestamp);

    emit!(PoolClosed {
        pool_id: pool.id,
        selected_option: response_option, // Use the input response_option
        decision_time: pool.decision_time,
        is_draw: pool.is_draw,
        winning_option: pool.winning_option,
    });

    Ok(())
}
