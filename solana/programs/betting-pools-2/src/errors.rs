use anchor_lang::prelude::*;

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
    #[msg("Pool is not graded yet")]
    PoolNotGraded,
    #[msg("Bet has already been paid out")]
    BetAlreadyPaidOut,
    #[msg("Caller is not the owner of the bet")]
    NotBetOwner,
    #[msg("Incorrect token mint for provided token account")]
    IncorrectTokenMint,
    #[msg("Error during grading process")]
    GradingError,
    #[msg("Calculated payout amount exceeds u64 max")]
    PayoutOverflow,
}