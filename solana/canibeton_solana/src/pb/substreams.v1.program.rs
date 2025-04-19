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
    pub image_url: ::prost::alloc::string::String,
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
    #[prost(int64, tag="12")]
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
    pub image_url: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub category: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub creator_name: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub creator_id: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub closure_criteria: ::prost::alloc::string::String,
    #[prost(string, tag="10")]
    pub closure_instructions: ::prost::alloc::string::String,
    #[prost(string, tag="11")]
    pub acct_betting_pools: ::prost::alloc::string::String,
    #[prost(string, tag="12")]
    pub acct_pool: ::prost::alloc::string::String,
    #[prost(string, tag="13")]
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
// @@protoc_insertion_point(module)
