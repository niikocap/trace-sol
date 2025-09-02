use anchor_lang::prelude::*;

declare_id!("DrkDgfwFuyTc2PpJFuhch3W3Lru5covEBDrXMV773NWB");

#[program]
pub mod trace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
