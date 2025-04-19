use anchor_lang::prelude::*;

declare_id!("2Mg5h1Hx6M8KkunpkzrMNtqJtkLp6uHX1u3gpmBoyxP5");

pub const BETTING_POOLS_SEED: &[u8] = b"betting_pools_v7";
pub const POOL_SEED: &[u8] = b"pool_v3";

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
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum PoolStatus {
    None,
    Pending,
    Graded,
    Regraded, // Disputed (unused for now)
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
