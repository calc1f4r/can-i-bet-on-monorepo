// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Data {
    #[prost(message, repeated, tag="1")]
    pub pool_created_event_list: ::prost::alloc::vec::Vec<PoolCreatedEvent>,
    #[prost(message, repeated, tag="2")]
    pub create_pool_instruction_list: ::prost::alloc::vec::Vec<CreatePoolInstruction>,
    #[prost(message, repeated, tag="3")]
    pub initialize_instruction_list: ::prost::alloc::vec::Vec<InitializeInstruction>,
    #[prost(message, repeated, tag="4")]
    pub bet_placed_event_list: ::prost::alloc::vec::Vec<BetPlacedEvent>,
    #[prost(message, repeated, tag="5")]
    pub place_bet_instruction_list: ::prost::alloc::vec::Vec<PlaceBetInstruction>,
    #[prost(message, repeated, tag="6")]
    pub pool_media_set_event_list: ::prost::alloc::vec::Vec<PoolMediaSetEvent>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PoolCreatedEvent {
    #[prost(string, tag="1")]
    pub tx_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub pool_id: u64,
    #[prost(string, tag="3")]
    pub question: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="4")]
    pub options: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(int64, tag="5")]
    pub bets_close_at: i64,
    #[prost(string, tag="6")]
    pub media_url: ::prost::alloc::string::String,
    #[prost(int32, tag="7")]
    pub media_type: i32,
    #[prost(string, tag="8")]
    pub category: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub creator_name: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub closure_criteria: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub closure_instructions: ::prost::alloc::string::String,
    #[prost(int64, tag="13")]
    pub created_at: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CreatePoolInstruction {
    #[prost(string, tag="1")]
    pub tx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub question: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="3")]
    pub options: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(int64, tag="4")]
    pub bets_close_at: i64,
    #[prost(string, tag="5")]
    pub media_url: ::prost::alloc::string::String,
    #[prost(int32, tag="6")]
    pub media_type: i32,
    #[prost(string, tag="7")]
    pub category: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub creator_name: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub closure_criteria: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub closure_instructions: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub acct_betting_pools: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
    pub acct_pool: ::prost::alloc::string::String,
    #[prost(string, tag="14")]
    pub acct_authority: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct InitializeInstruction {
    #[prost(string, tag="1")]
    pub trx_hash: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub usdc_mint: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub bet_points_mint: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub acct_betting_pools: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub acct_authority: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BetPlacedEvent {
    #[prost(string, tag="1")]
    pub tx_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub bet_id: u64,
    #[prost(uint64, tag="3")]
    pub pool_id: u64,
    #[prost(string, tag="4")]
    pub user: ::prost::alloc::string::String,
    #[prost(uint64, tag="5")]
    pub option_index: u64,
    #[prost(uint64, tag="6")]
    pub amount: u64,
    #[prost(int32, tag="7")]
    pub token_type: i32,
    #[prost(int64, tag="8")]
    pub created_at: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PoolMediaSetEvent {
    #[prost(string, tag="1")]
    pub tx_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub pool_id: u64,
    #[prost(string, tag="3")]
    pub media_url: ::prost::alloc::string::String,
    #[prost(int32, tag="4")]
    pub media_type: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PlaceBetInstruction {
    #[prost(string, tag="1")]
    pub tx_hash: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub option_index: u64,
    #[prost(uint64, tag="3")]
    pub amount: u64,
    #[prost(int32, tag="4")]
    pub token_type: i32,
    #[prost(string, tag="5")]
    pub acct_betting_pools: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub acct_pool: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub acct_bet: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub acct_bettor: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub acct_bettor_token_account: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub acct_program_token_account: ::prost::alloc::string::String,
}
// @@protoc_insertion_point(module)
