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
        has_one = authority @ BettingPoolsError::NotAuthorized,
        constraint = betting_pools.is_initialized @ BettingPoolsError::NotInitialized
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        mut,
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump,
        constraint = pool.status == PoolStatus::Pending @ BettingPoolsError::PoolAlreadyGraded
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
    let clock = Clock::get()?;

    // Validate the response option - only 0, 1, or 2 are valid
    if response_option > 2 {
        return err!(BettingPoolsError::InvalidOptionIndex);
    }

    // Set decision time to current time unless overridden
    let decision_time = decision_time_override.unwrap_or(clock.unix_timestamp);

    // If decision time is provided, validate it
    if let Some(override_time) = decision_time_override {
        // Decision time shouldn't be in the future
        if override_time > clock.unix_timestamp {
            return err!(BettingPoolsError::GradingError);
        }
    }

    // Update the pool status before any other changes to prevent reentrancy issues
    pool.status = PoolStatus::Graded;

    // Set the pool's winning option and draw status
    match response_option {
        0 => {
            pool.winning_option = 0;
            pool.is_draw = false;
        },
        1 => {
            pool.winning_option = 1;
            pool.is_draw = false;
        },
        2 => {
            pool.is_draw = true;
            pool.winning_option = 0; // Default value for draws
        },
        _ => unreachable!(), // We've already validated response_option is 0, 1, or 2
    }

    // Set the decision time
    pool.decision_time = decision_time;

    // Log the grading action for audit purposes
    msg!("Pool {} graded: option={}, is_draw={}, decision_time={}", 
        pool.id, response_option, pool.is_draw, decision_time);

    // Emit the PoolClosed event
    emit!(PoolClosed {
        pool_id: pool.id,
        selected_option: response_option,
        decision_time: pool.decision_time,
        is_draw: pool.is_draw,
        winning_option: pool.winning_option,
    });

    Ok(())
}
