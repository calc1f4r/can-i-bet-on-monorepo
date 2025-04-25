use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::states::{BettingPoolsState, Pool, Bet, PoolStatus, BetOutcome, TokenType, BetPlaced};
use crate::errors::BettingPoolsError;
use crate::constants::{BETTING_POOLS_SEED, POOL_SEED, BET_SEED};

#[derive(Accounts)]
#[instruction(option_index: u64, amount: u64, token_type: TokenType)]
pub struct PlaceBet<'info> {
    #[account(
        mut,
        seeds = [BETTING_POOLS_SEED],
        bump
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        mut,
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        init,
        payer = bettor,
        space = 8 + Bet::INIT_SPACE,
        seeds = [BET_SEED, pool.id.to_le_bytes().as_ref(), betting_pools.next_bet_id.to_le_bytes().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub bettor: Signer<'info>,

    #[account(
        mut,
        token::authority = bettor,
        token::mint = if token_type == TokenType::Usdc { betting_pools.usdc_mint } else { betting_pools.bet_points_mint }
    )]
    pub bettor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = if token_type == TokenType::Usdc { betting_pools.usdc_mint } else { betting_pools.bet_points_mint }
    )]
    pub program_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/// Place a bet on a pool
/// Similar to the placeBet function in the Solidity version
pub fn place_bet(
    ctx: Context<PlaceBet>,
    option_index: u64,
    amount: u64,
    token_type: TokenType,
) -> Result<()> {
    let betting_pools = &ctx.accounts.betting_pools;
    let pool = &mut ctx.accounts.pool;
    let bet = &mut ctx.accounts.bet;
    let bettor = &ctx.accounts.bettor;
    let clock = Clock::get()?;

    // Check if betting period is closed
    if clock.unix_timestamp > pool.bets_close_at {
        return err!(BettingPoolsError::BettingPeriodClosed);
    }

    // Check if pool is open for betting
    if pool.status != PoolStatus::Pending {
        return err!(BettingPoolsError::PoolNotOpen);
    }

    // Check if option index is valid
    if option_index >= 2 {
        return err!(BettingPoolsError::InvalidOptionIndex);
    }

    // Check if amount is valid
    if amount == 0 {
        return err!(BettingPoolsError::ZeroAmount);
    }

    // Transfer tokens from bettor to program account
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.bettor_token_account.to_account_info(),
                to: ctx.accounts.program_token_account.to_account_info(),
                authority: bettor.to_account_info(),
            },
        ),
        amount,
    )?;

    // Initialize the bet
    let bet_id = betting_pools.next_bet_id;

    bet.id = bet_id;
    bet.owner = bettor.key();
    bet.option = option_index;
    bet.amount = amount;
    bet.pool_id = pool.id;
    bet.created_at = clock.unix_timestamp;
    bet.updated_at = clock.unix_timestamp; // Compatibility field
    bet.is_payed_out = false;
    bet.outcome = BetOutcome::None;
    bet.token_type = token_type;
    bet.bump = ctx.bumps.bet;

    // Update totals in the pool
    if token_type == TokenType::Usdc {
        pool.usdc_bet_totals[option_index as usize] += amount;
    } else {
        pool.points_bet_totals[option_index as usize] += amount;
    }

    // Emit the BetPlaced event
    emit!(BetPlaced {
        bet_id,
        pool_id: pool.id,
        user: bettor.key(),
        option_index,
        amount,
        token_type,
        created_at: clock.unix_timestamp,
    });

    // Increment the bet ID counter
    let betting_pools = &mut ctx.accounts.betting_pools;
    betting_pools.next_bet_id += 1;

    Ok(())
}