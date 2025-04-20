use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("9nW58a3uYAveyKAxpytoSwobwGTMm4QHJwzKiiGK7RXK");

pub const BETTING_POOLS_SEED: &[u8] = b"betting_pools_v7";
pub const POOL_SEED: &[u8] = b"pool_v3";
pub const BET_SEED: &[u8] = b"bet_v1";

#[program]
pub mod betting_pools_2 {
    use super::*;

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

    /// Create a new betting pool
    /// Similar to the createPool function in the Solidity version
    pub fn create_pool(
        ctx: Context<CreatePool>,
        question: String,
        options: [String; 2],
        bets_close_at: i64,
        image_url: String,
        category: String,
        creator_name: String,
        creator_id: String,
        closure_criteria: String,
        closure_instructions: String,
    ) -> Result<()> {
        let betting_pools = &mut ctx.accounts.betting_pools;
        let pool = &mut ctx.accounts.pool;

        // Check if bets close time is in the future
        let clock = Clock::get()?;
        msg!("Bets close time: {}", bets_close_at);
        if bets_close_at <= clock.unix_timestamp {
            msg!("Bets close time must be in the future");
            return err!(BettingPoolsError::BetsCloseTimeInPast);
        }

        // Set the pool ID and increment the counter
        let pool_id = betting_pools.next_pool_id;
        betting_pools.next_pool_id += 1;

        // Initialize the pool
        pool.id = pool_id;
        pool.question = question;
        pool.options = options;
        pool.bets_close_at = bets_close_at;
        pool.decision_time = 0; // Initially set to 0, will be set when pool is graded
        pool.usdc_bet_totals = [0, 0];
        pool.points_bet_totals = [0, 0];
        pool.winning_option = 0;
        pool.status = PoolStatus::Pending;
        pool.is_draw = false;
        pool.created_at = clock.unix_timestamp;
        pool.image_url = image_url;
        pool.category = category;
        pool.creator_name = creator_name;
        pool.creator_id = creator_id;
        pool.closure_criteria = closure_criteria;
        pool.closure_instructions = closure_instructions;
        pool.bump = ctx.bumps.pool;

        emit!(PoolCreated {
            pool_id,
            question: pool.question.clone(),
            options: pool.options.clone(),
            bets_close_at: pool.bets_close_at.clone(),
            image_url: pool.image_url.clone(),
            category: pool.category.clone(),
            creator_name: pool.creator_name.clone(),
            creator_id: pool.creator_id.clone(),
            closure_criteria: pool.closure_criteria.clone(),
            closure_instructions: pool.closure_instructions.clone(),
            created_at: pool.created_at.clone()
        });

        Ok(())
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
        // Note: The token accounts are validated in the PlaceBet context
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
        // No longer actively updating this field, but keeping it for compatibility
        bet.updated_at = clock.unix_timestamp;
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
}

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

// Create pool context
#[derive(Accounts)]
#[instruction(
    question: String,
    options: [String; 2],
    bets_close_at: i64
)]
pub struct CreatePool<'info> {
    #[account(
        mut,
        seeds = [BETTING_POOLS_SEED],
        bump,
        has_one = authority @ BettingPoolsError::NotAuthorized
    )]
    pub betting_pools: Account<'info, BettingPoolsState>,

    #[account(
        init,
        payer = authority,
        space = 8 + Pool::INIT_SPACE,
        //TODO How can we tie the seed to the deployed betting pool contracts?
        // seeds = [POOL_SEED, 1_u64.to_le_bytes().as_ref()],//, betting_pools.next_pool_id.to_le_bytes().as_ref()],
        seeds = [POOL_SEED, betting_pools.next_pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum BettingPoolsError {
    #[msg("Bets close time must be in the future")]
    BetsCloseTimeInPast,
    #[msg("Bets close time must be before decision time")]
    BetsCloseAfterDecision,
    #[msg("Pool is not open")]
    PoolNotOpen,
    #[msg("Pool doesn't exist")]
    PoolDoesntExist,
    #[msg("Betting period is closed")]
    BettingPeriodClosed,
    #[msg("Invalid option index")]
    InvalidOptionIndex,
    #[msg("Bet already exists")]
    BetAlreadyExists,
    #[msg("BettingPools is already initialized")]
    AlreadyInitialized,
    #[msg("Zero amount")]
    ZeroAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Not authorized")]
    NotAuthorized,
    #[msg("Token transfer failed")]
    TokenTransferFailed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum PoolStatus {
    None,
    Pending,
    Graded,
    Regraded, // Disputed (unused for now)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum BetOutcome {
    None,
    Won,
    Lost,
    Voided,
    Draw,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum TokenType {
    Usdc,
    Points,
}

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub id: u64,
    #[max_len(150)]
    pub question: String,
    #[max_len(50, 50)]
    pub options: [String; 2], // Max length for each string in the array
    pub bets_close_at: i64,
    pub decision_time: i64,
    pub usdc_bet_totals: [u64; 2],
    pub points_bet_totals: [u64; 2],
    pub winning_option: u64,
    pub status: PoolStatus,
    pub is_draw: bool,
    pub created_at: i64,
    #[max_len(200)]
    pub image_url: String,
    #[max_len(25)]
    pub category: String,
    #[max_len(50)]
    pub creator_name: String,
    #[max_len(50)]
    pub creator_id: String,
    #[max_len(150)]
    pub closure_criteria: String,
    #[max_len(150)]
    pub closure_instructions: String,
    #[max_len(32)]
    pub twitter_post_id: String,
    pub bump: u8,
}

#[event]
pub struct PoolCreated {
    pub pool_id: u64,
    pub question: String,
    pub options: [String; 2],
    pub bets_close_at: i64,
    pub image_url: String,
    pub category: String,
    pub creator_name: String,
    pub creator_id: String,
    pub closure_criteria: String,
    pub closure_instructions: String,
    pub created_at: i64,
}

#[event]
pub struct BetPlaced {
    pub bet_id: u64,
    pub pool_id: u64,
    pub user: Pubkey,
    pub option_index: u64,
    pub amount: u64,
    pub token_type: TokenType,
    pub created_at: i64,
}

#[event]
pub struct PoolClosed {
    pub pool_id: u64,
    pub selected_option: u64,
    pub decision_time: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Bet {
    pub id: u64,
    pub owner: Pubkey,
    pub option: u64,
    pub amount: u64,
    pub pool_id: u64,
    pub created_at: i64,
    pub updated_at: i64,
    pub is_payed_out: bool,
    pub outcome: BetOutcome,
    pub token_type: TokenType,
    pub bump: u8,
}

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
    pub bettor_token_account: Account<'info, token::TokenAccount>,

    #[account(
        mut,
        token::mint = if token_type == TokenType::Usdc { betting_pools.usdc_mint } else { betting_pools.bet_points_mint }
    )]
    pub program_token_account: Account<'info, token::TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
