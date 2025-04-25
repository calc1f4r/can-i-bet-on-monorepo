use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::states::{BettingPoolsState, Pool, Bet, PoolStatus, TokenType, BetOutcome, PayoutClaimed};
use crate::errors::BettingPoolsError;
use crate::constants::{BETTING_POOLS_SEED, POOL_SEED, BET_SEED};

// Claim payout context
#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    #[account(
        seeds = [BETTING_POOLS_SEED],
        bump
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        mut,
        seeds = [BET_SEED, pool.id.to_le_bytes().as_ref(), bet.id.to_le_bytes().as_ref()],
        bump = bet.bump,
        constraint = bet.owner == bettor.key() @ BettingPoolsError::NotBetOwner,
        constraint = bet.pool_id == pool.id
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub bettor: Signer<'info>,

    #[account(
        mut,
        token::authority = bettor
    )]
    pub bettor_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub program_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
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

    // Check if the pool is graded
    if pool.status != PoolStatus::Graded {
        return err!(BettingPoolsError::PoolNotGraded);
    }

    // Check if bet is already paid out (using the field from Bet struct)
    if bet.is_payed_out {
        return err!(BettingPoolsError::BetAlreadyPaidOut); // Use a more specific error
    }

    // Mark bet as paid out immediately to prevent double claims
    bet.is_payed_out = true;
    bet.outcome = BetOutcome::None; // Default, will be updated below

    let token_type = bet.token_type;

    // Determine the correct mint and check token accounts
    let mint_address = if token_type == TokenType::Usdc {
        betting_pools.usdc_mint
    } else {
        betting_pools.bet_points_mint // Assuming bet_points_mint exists in BettingPoolsState
    };

    if bettor_token_account.mint != mint_address {
        // Return an error indicating incorrect bettor token account mint
        return err!(BettingPoolsError::IncorrectTokenMint);
    }
    if program_token_account.mint != mint_address {
        // Return an error indicating incorrect program token account mint
        return err!(BettingPoolsError::IncorrectTokenMint);
    }

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
        let losing_option = if pool.winning_option == 0 { 1 } else { 0 };

        if bet.option == pool.winning_option {
            // Calculate winnings
            // Ensure floating point is not used. Perform multiplication first.
            // Use u128 for intermediate calculation to prevent overflow
            let total_losing_bets = bet_totals[losing_option as usize] as u128;
            let total_winning_bets = bet_totals[pool.winning_option as usize] as u128;
            let bet_amount = bet.amount as u128;

            let winnings = (bet_amount * total_losing_bets) / total_winning_bets;
            let gross_payout = winnings + bet_amount; // Winnings + original stake

            // Calculate fee (ensure payout_fee_bp is u16 or cast appropriately)
            let fee = (gross_payout * betting_pools.payout_fee_bp as u128) / 10000;
            let net_payout = gross_payout - fee;

            // Ensure net_payout fits in u64
            if net_payout > u64::MAX as u128 {
                 // Handle potential overflow, maybe return an error or cap the payout
                 // For now, let's return an error
                 return err!(BettingPoolsError::PayoutOverflow);
            }
            amount_to_transfer = net_payout as u64;
            final_outcome = BetOutcome::Won;

            // Note: Fee stays in the program account (no explicit transfer needed here)

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
        // Define PDA seeds for signing the transfer
        let betting_pools_seeds = &[
            BETTING_POOLS_SEED,
            &[ctx.bumps.betting_pools], // Use the bump from the betting_pools account context
        ];
        let signer_seeds = &[&betting_pools_seeds[..]];

        // Create the CPI context with the signer
        let cpi_accounts = Transfer {
            from: program_token_account.to_account_info(),
            to: bettor_token_account.to_account_info(),
            authority: betting_pools.to_account_info(), // The PDA is the authority
        };
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        // Perform the transfer
        token::transfer(cpi_context, amount_to_transfer)?;

        emit!(PayoutClaimed {
            bet_id: bet.id,
            pool_id: pool.id,
            user: bet.owner,
            amount: amount_to_transfer,
            outcome: final_outcome, // Use the determined outcome
            token_type,
        });
    } else {
         // Emit event even for zero payout (e.g., for lost bets)
         emit!(PayoutClaimed {
            bet_id: bet.id,
            pool_id: pool.id,
            user: bet.owner,
            amount: 0,
            outcome: final_outcome,
            token_type,
        });
    }

    Ok(())
}
