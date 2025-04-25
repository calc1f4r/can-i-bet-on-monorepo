use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum PoolStatus {
    None,
    Pending,
    Graded,
    Regraded, // Disputed (unused for now)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MediaType {
    X,
    TikTok,
    Instagram,
    Facebook,
    Image,
    Video,
    ExternalLink,
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
    pub media_url: String,
    pub media_type: MediaType,
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
    pub media_url: String,
    pub media_type: MediaType,
    pub category: String,
    pub creator_name: String,
    pub creator_id: String,
    pub closure_criteria: String,
    pub closure_instructions: String,
    pub created_at: i64,
}

#[event]
pub struct PoolClosed {
    pub pool_id: u64,
    pub selected_option: u64,
    pub decision_time: i64,
}

#[event]
pub struct PoolMediaSet {
    pub pool_id: u64,
    pub media_url: String,
    pub media_type: MediaType,
}