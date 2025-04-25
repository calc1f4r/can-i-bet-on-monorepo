use anchor_lang::prelude::*;
use crate::states::{Pool, MediaType, PoolMediaSet};
use crate::constants::POOL_SEED;

#[derive(Accounts)]
#[instruction(media_url: String, media_type: MediaType)]
pub struct SetMedia<'info> {
    #[account(
        mut,
        seeds = [POOL_SEED, pool.id.to_le_bytes().as_ref()],
        bump = pool.bump, // Use the bump stored in the pool account
    )]
    pub pool: Account<'info, Pool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Update the media URL and type for a pool
pub fn set_media(
    ctx: Context<SetMedia>,
    media_url: String,
    media_type: MediaType,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    
    // Update the media information
    pool.media_url = media_url.clone();
    pool.media_type = media_type;
    
    // Emit the PoolMediaSet event
    emit!(PoolMediaSet {
        pool_id: pool.id,
        media_url,
        media_type,
    });
    
    Ok(())
}