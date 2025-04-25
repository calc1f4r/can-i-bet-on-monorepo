use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::states::{BettingPoolsState, Pool, Bet, PoolStatus, TokenType, BetOutcome, PayoutClaimed};
use crate::errors::BettingPoolsError;
use crate::constants::{BETTING_POOLS_SEED, POOL_SEED, BET_SEED};

// Claim payout context
#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    #[account(
        seeds = [BETTING_POOLS_SEED],
        bump,
        constraint = betting_pools.is_initialized @ BettingPoolsError::NotInitialized
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump,
        constraint = pool.status == PoolStatus::Graded @ BettingPoolsError::PoolNotGraded
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        mut,
        seeds = [BET_SEED, pool.id.to_le_bytes().as_ref(), bet.id.to_le_bytes().as_ref()],
        bump = bet.bump,
        constraint = bet.owner == bettor.key() @ BettingPoolsError::NotBetOwner,
        constraint = bet.pool_id == pool.id,
        constraint = !bet.is_payed_out @ BettingPoolsError::BetAlreadyPaidOut
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub bettor: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = if bet.token_type == TokenType::Usdc { betting_pools.usdc_mint } else { betting_pools.bet_points_mint },
        associated_token::authority = bettor
    )]
    pub bettor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = program_token_account.mint == 
            (if bet.token_type == TokenType::Usdc { betting_pools.usdc_mint } 
            else { betting_pools.bet_points_mint }) @ BettingPoolsError::TokenAccountMismatch
    )]
    pub program_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

/// Claim payouts for a bet
pub fn claim_payout(
    ctx: Context<ClaimPayout>,
) -> Result<()> {
    let pool = &ctx.accounts.pool;
    let bet = &mut ctx.accounts.bet;
    let betting_pools = &ctx.accounts.betting_pools;
    let bettor_token_account = &ctx.accounts.bettor_token_account;
    let program_token_account = &ctx.accounts.program_token_account;

    // Mark bet as paid out immediately to prevent reentrancy attacks
    bet.is_payed_out = true;
    bet.outcome = BetOutcome::None; // Default, will be updated below

    let token_type = bet.token_type;

    // Get the appropriate betTotals based on token type
    let bet_totals = if token_type == TokenType::Usdc {
        pool.usdc_bet_totals
    } else {
        pool.points_bet_totals
    };

    let amount_to_transfer: u64;
    let final_outcome: BetOutcome;

    // Check if bet should be voided (placed at or after decision time)
    if pool.decision_time > 0 && bet.created_at >= pool.decision_time {
        amount_to_transfer = bet.amount; // Refund the original amount
        final_outcome = BetOutcome::Voided;
    }
    // If it is a draw or there are no bets on one side or the other for this token type, refund the bet
    else if pool.is_draw || bet_totals[0] == 0 || bet_totals[1] == 0 {
        amount_to_transfer = bet.amount;
        final_outcome = if pool.is_draw { BetOutcome::Draw } else { BetOutcome::Voided }; // Void if unbalanced, Draw if explicitly draw
    } else {
        // Ensure winning option is valid
        if pool.winning_option >= 2 {
            return err!(BettingPoolsError::InvalidOptionIndex);
        }
        
        let losing_option = if pool.winning_option == 0 { 1 } else { 0 };

        if bet.option == pool.winning_option {
            // Calculate winnings - use checked operations to prevent overflow
            let total_losing_bets = bet_totals[losing_option as usize] as u128;
            let total_winning_bets = bet_totals[pool.winning_option as usize] as u128;
            
            // Guard against division by zero
            if total_winning_bets == 0 {
                return err!(BettingPoolsError::DivisionByZero);
            }
            
            let bet_amount = bet.amount as u128;

            // Calculate winnings with proper overflow checking
            let winnings = (bet_amount.checked_mul(total_losing_bets)
                .ok_or(BettingPoolsError::ArithmeticOverflow)?) / total_winning_bets;
                
            let gross_payout = winnings.checked_add(bet_amount)
                .ok_or(BettingPoolsError::ArithmeticOverflow)?; // Winnings + original stake

            // Calculate fee with overflow protection
            let fee = (gross_payout.checked_mul(betting_pools.payout_fee_bp as u128)
                .ok_or(BettingPoolsError::ArithmeticOverflow)?) / 10000;
                
            let net_payout = gross_payout.checked_sub(fee)
                .ok_or(BettingPoolsError::ArithmeticOverflow)?;

            // Ensure net_payout fits in u64
            if net_payout > u64::MAX as u128 {
                 return err!(BettingPoolsError::PayoutOverflow);
            }
            amount_to_transfer = net_payout as u64;
            final_outcome = BetOutcome::Won;

        } else {
            // Losing bets get nothing back
            amount_to_transfer = 0;
            final_outcome = BetOutcome::Lost;
        }
    }

    // Update the bet's outcome
    bet.outcome = final_outcome;

    // If there's an amount to transfer, perform the CPI transfer
    if amount_to_transfer > 0 {
        // Verify program token account has sufficient funds
        if program_token_account.amount < amount_to_transfer {
            return err!(BettingPoolsError::InsufficientBalance);
        }
        
        // Get PDA signer for the token program
        let program_seeds = &[
            BETTING_POOLS_SEED,
            &[ctx.bumps.betting_pools], 
        ];
        let signer_seeds = &[&program_seeds[..]];

        // Create the CPI context with the signer
        let cpi_accounts = Transfer {
            from: program_token_account.to_account_info(),
            to: bettor_token_account.to_account_info(),
            authority: betting_pools.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        // Perform the transfer with detailed error handling
        token::transfer(cpi_context, amount_to_transfer)
            .map_err(|_| BettingPoolsError::TokenTransferFailed)?;
    }

    // Always emit the event for tracking purposes
    emit!(PayoutClaimed {
        bet_id: bet.id,
        pool_id: pool.id,
        user: bet.owner,
        amount: amount_to_transfer,
        outcome: final_outcome,
        token_type,
    });

    msg!("Payout claimed: Bet={}, Amount={}, Outcome={:?}", 
        bet.id, amount_to_transfer, final_outcome);

    Ok(())
}
