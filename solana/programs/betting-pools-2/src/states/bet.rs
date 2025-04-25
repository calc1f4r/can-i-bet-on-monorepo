use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
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