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
    #[msg("BettingPools is not initialized")]
    NotInitialized,
    #[msg("Invalid token account owner")]
    InvalidTokenAccountOwner,
    #[msg("Bet amount exceeds maximum limit")]
    BetAmountTooLarge,
    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,
    #[msg("Pool is already graded")]
    PoolAlreadyGraded,
    #[msg("Invalid program token account")]
    InvalidProgramTokenAccount,
    #[msg("Division by zero error")]
    DivisionByZero,
    #[msg("Pool has zero winners")]
    ZeroWinners,
    #[msg("Token account does not match bet token type")]
    TokenAccountMismatch,
}