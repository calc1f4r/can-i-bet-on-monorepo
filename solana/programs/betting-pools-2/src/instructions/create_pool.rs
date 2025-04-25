use anchor_lang::prelude::*;
use crate::states::{BettingPoolsState, Pool, PoolStatus, MediaType, PoolCreated};
use crate::errors::BettingPoolsError;
use crate::constants::{BETTING_POOLS_SEED, POOL_SEED};

// Create pool context
#[derive(Accounts)]
#[instruction(
    question: String,
    options: [String; 2],
    bets_close_at: i64,
    media_url: String,
    media_type: MediaType
)]
pub struct CreatePool<'info> {
    #[account(
        mut,
        seeds = [BETTING_POOLS_SEED],
        bump,
        has_one = authority @ BettingPoolsError::NotAuthorized,
        constraint = betting_pools.is_initialized @ BettingPoolsError::NotInitialized
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        init,
        payer = authority,
        space = 8 + Pool::INIT_SPACE,
        seeds = [POOL_SEED, betting_pools.next_pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Create a new betting pool
/// Similar to the createPool function in the Solidity version
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
    let betting_pools = &mut ctx.accounts.betting_pools;
    let pool = &mut ctx.accounts.pool;

    // Validate inputs
    if question.trim().is_empty() {
        return err!(BettingPoolsError::GradingError);
    }
    
    // Ensure option strings are not empty
    if options[0].trim().is_empty() || options[1].trim().is_empty() {
        return err!(BettingPoolsError::GradingError);
    }

    // Check if bets close time is in the future
    let clock = Clock::get()?;
    
    // Add a minimum betting period to prevent flash attacks where pool is
    // created and immediately closed
    const MIN_BETTING_PERIOD: i64 = 300; // 5 minutes minimum
    if bets_close_at <= clock.unix_timestamp + MIN_BETTING_PERIOD {
        msg!("Bets close time must be at least {} seconds in the future", MIN_BETTING_PERIOD);
        return err!(BettingPoolsError::BetsCloseTimeInPast);
    }

    // Set the pool ID before doing anything else to prevent potential 
    // issues with incrementing the counter without assigning the ID
    let pool_id = betting_pools.next_pool_id;
    
    // Initialize the pool with secure defaults first
    pool.id = pool_id;
    pool.question = question;
    pool.options = options;
    pool.bets_close_at = bets_close_at;
    pool.decision_time = 0; 
    pool.usdc_bet_totals = [0, 0];
    pool.points_bet_totals = [0, 0];
    pool.winning_option = 0;
    pool.status = PoolStatus::Pending;
    pool.is_draw = false;
    pool.created_at = clock.unix_timestamp;
    pool.media_url = media_url;
    pool.media_type = media_type;
    pool.category = category;
    pool.creator_name = creator_name;
    pool.creator_id = creator_id;
    pool.closure_criteria = closure_criteria;
    pool.closure_instructions = closure_instructions;
    pool.twitter_post_id = String::new(); // Initialize empty
    pool.bump = ctx.bumps.pool;

    // Now that pool initialization is successful, increment the counter
    betting_pools.next_pool_id += 1;

    // Log creation for audit purposes
    msg!("Pool {} created: question=\"{}\", closes at {}", 
        pool_id, &pool.question, bets_close_at);

    // Emit event with all relevant pool data
    emit!(PoolCreated {
        pool_id,
        question: pool.question.clone(),
        options: pool.options.clone(),
        bets_close_at: pool.bets_close_at,
        media_url: pool.media_url.clone(),
        media_type: pool.media_type,
        category: pool.category.clone(),
        creator_name: pool.creator_name.clone(),
        creator_id: pool.creator_id.clone(),
        closure_criteria: pool.closure_criteria.clone(),
        closure_instructions: pool.closure_instructions.clone(),
        created_at: pool.created_at
    });

    Ok(())
}