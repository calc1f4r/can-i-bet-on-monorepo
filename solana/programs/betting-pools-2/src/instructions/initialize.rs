use anchor_lang::prelude::*;
use crate::states::BettingPoolsState;
use crate::errors::BettingPoolsError;
use crate::constants::BETTING_POOLS_SEED;

// Initialize context
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BettingPoolsState::INIT_SPACE,
        seeds = [BETTING_POOLS_SEED],
        bump
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Initialize the BettingPools program
/// Similar to the constructor in the Solidity version
pub fn initialize(
    ctx: Context<Initialize>,
    usdc_mint: Pubkey,
    bet_points_mint: Pubkey,
) -> Result<()> {
    let betting_pools = &mut ctx.accounts.betting_pools;

    msg!("Initializing BettingPools");
    // Check if already initialized
    if betting_pools.is_initialized {
        msg!("BettingPools is already initialized");
        return err!(BettingPoolsError::AlreadyInitialized);
    }

    // Mark as initialized
    betting_pools.is_initialized = true;

    // Set the authority to the signer
    betting_pools.authority = ctx.accounts.authority.key();

    // Set up token mints
    betting_pools.usdc_mint = usdc_mint;
    betting_pools.bet_points_mint = bet_points_mint;

    // Initialize counters
    betting_pools.next_pool_id = 1;
    betting_pools.next_bet_id = 1;

    // Set payout fee basis points (0.9% like in Solidity)
    betting_pools.payout_fee_bp = 90;

    msg!("BettingPools program initialized");
    Ok(())
}