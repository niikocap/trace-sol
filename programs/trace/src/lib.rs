use anchor_lang::prelude::*;

declare_id!("DrkDgfwFuyTc2PpJFuhch3W3Lru5covEBDrXMV773NWB");

#[program]
pub mod trace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // ============= CHAIN ACTOR METHODS =============
    
    pub fn create_chain_actor(
        ctx: Context<CreateChainActor>,
        name: String,
        actor_type: String,
        farm_id: Option<u64>,
        farmer_id: Option<u64>,
        assigned_tps: u64,
        organization: Option<Organization>,
        province_id: Option<u64>,
        city_id: Option<u64>,
        address: String,
    ) -> Result<()> {
        let chain_actor = &mut ctx.accounts.chain_actor;
        
        chain_actor.discriminator = ChainActor::DISCRIMINATOR;
        chain_actor.name = name;
        chain_actor.actor_type = actor_type;
        chain_actor.farm_id = farm_id;
        chain_actor.farmer_id = farmer_id;
        chain_actor.assigned_tps = assigned_tps;
        chain_actor.organization = organization;
        chain_actor.province_id = province_id;
        chain_actor.city_id = city_id;
        chain_actor.address = address;
        chain_actor.is_active = true;
        chain_actor.balance = 0;
        chain_actor.pin = None;
        chain_actor.created_at = Clock::get()?.unix_timestamp;
        chain_actor.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Chain actor created: {}", chain_actor.name);
        Ok(())
    }

    pub fn update_chain_actor(
        ctx: Context<UpdateChainActor>,
        name: Option<String>,
        is_active: Option<bool>,
        balance: Option<u64>,
        pin: Option<String>,
        organization: Option<Organization>,
        address: Option<String>,
    ) -> Result<()> {
        let chain_actor = &mut ctx.accounts.chain_actor;
        
        if let Some(name) = name {
            chain_actor.name = name;
        }
        if let Some(is_active) = is_active {
            chain_actor.is_active = is_active;
        }
        if let Some(balance) = balance {
            chain_actor.balance = balance;
        }
        if let Some(pin) = pin {
            chain_actor.pin = Some(pin);
        }
        if let Some(organization) = organization {
            chain_actor.organization = Some(organization);
        }
        if let Some(address) = address {
            chain_actor.address = address;
        }
        
        chain_actor.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Chain actor updated: {}", chain_actor.name);
        Ok(())
    }

    // ============= PRODUCTION SEASON METHODS =============
    
    pub fn create_production_season(
        ctx: Context<CreateProductionSeason>,
        name: String,
        start_date: i64,
        end_date: i64,
        description: Option<String>,
    ) -> Result<()> {
        let production_season = &mut ctx.accounts.production_season;
        
        production_season.discriminator = ProductionSeason::DISCRIMINATOR;
        production_season.name = name;
        production_season.start_date = start_date;
        production_season.end_date = end_date;
        production_season.description = description;
        production_season.is_active = true;
        production_season.created_at = Clock::get()?.unix_timestamp;
        production_season.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Production season created: {}", production_season.name);
        Ok(())
    }

    pub fn update_production_season(
        ctx: Context<UpdateProductionSeason>,
        name: Option<String>,
        start_date: Option<i64>,
        end_date: Option<i64>,
        description: Option<String>,
        is_active: Option<bool>,
    ) -> Result<()> {
        let production_season = &mut ctx.accounts.production_season;
        
        if let Some(name) = name {
            production_season.name = name;
        }
        if let Some(start_date) = start_date {
            production_season.start_date = start_date;
        }
        if let Some(end_date) = end_date {
            production_season.end_date = end_date;
        }
        if let Some(description) = description {
            production_season.description = Some(description);
        }
        if let Some(is_active) = is_active {
            production_season.is_active = is_active;
        }
        
        production_season.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Production season updated: {}", production_season.name);
        Ok(())
    }

    // ============= MILLED RICE METHODS =============
    
    pub fn create_milled_rice(
        ctx: Context<CreateMilledRice>,
        variety: String,
        grade: String,
        quantity_kg: u64,
        milling_date: i64,
        expiry_date: Option<i64>,
        storage_location: String,
    ) -> Result<()> {
        let milled_rice = &mut ctx.accounts.milled_rice;
        
        milled_rice.variety = variety;
        milled_rice.grade = grade;
        milled_rice.quantity_kg = quantity_kg;
        milled_rice.milling_date = milling_date;
        milled_rice.expiry_date = expiry_date;
        milled_rice.storage_location = storage_location;
        milled_rice.is_available = true;
        milled_rice.created_at = Clock::get()?.unix_timestamp;
        milled_rice.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Milled rice created: {} - {}", milled_rice.variety, milled_rice.grade);
        Ok(())
    }

    pub fn update_milled_rice(
        ctx: Context<UpdateMilledRice>,
        variety: Option<String>,
        grade: Option<String>,
        quantity_kg: Option<u64>,
        expiry_date: Option<i64>,
        storage_location: Option<String>,
        is_available: Option<bool>,
    ) -> Result<()> {
        let milled_rice = &mut ctx.accounts.milled_rice;
        
        if let Some(variety) = variety {
            milled_rice.variety = variety;
        }
        if let Some(grade) = grade {
            milled_rice.grade = grade;
        }
        if let Some(quantity_kg) = quantity_kg {
            milled_rice.quantity_kg = quantity_kg;
        }
        if let Some(expiry_date) = expiry_date {
            milled_rice.expiry_date = Some(expiry_date);
        }
        if let Some(storage_location) = storage_location {
            milled_rice.storage_location = storage_location;
        }
        if let Some(is_available) = is_available {
            milled_rice.is_available = is_available;
        }
        
        milled_rice.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Milled rice updated: {} - {}", milled_rice.variety, milled_rice.grade);
        Ok(())
    }

    // ============= RICE BATCH METHODS =============
    
    pub fn create_rice_batch(
        ctx: Context<CreateRiceBatch>,
        batch_number: String,
        variety: String,
        quantity_kg: u64,
        harvest_date: i64,
        farmer_id: u64,
        farm_location: String,
        quality_grade: String,
    ) -> Result<()> {
        let rice_batch = &mut ctx.accounts.rice_batch;
        
        rice_batch.batch_number = batch_number;
        rice_batch.variety = variety;
        rice_batch.quantity_kg = quantity_kg;
        rice_batch.harvest_date = harvest_date;
        rice_batch.farmer_id = farmer_id;
        rice_batch.farm_location = farm_location;
        rice_batch.quality_grade = quality_grade;
        rice_batch.status = "harvested".to_string();
        rice_batch.created_at = Clock::get()?.unix_timestamp;
        rice_batch.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Rice batch created: {}", rice_batch.batch_number);
        Ok(())
    }

    pub fn update_rice_batch(
        ctx: Context<UpdateRiceBatch>,
        variety: Option<String>,
        quantity_kg: Option<u64>,
        quality_grade: Option<String>,
        status: Option<String>,
    ) -> Result<()> {
        let rice_batch = &mut ctx.accounts.rice_batch;
        
        if let Some(variety) = variety {
            rice_batch.variety = variety;
        }
        if let Some(quantity_kg) = quantity_kg {
            rice_batch.quantity_kg = quantity_kg;
        }
        if let Some(quality_grade) = quality_grade {
            rice_batch.quality_grade = quality_grade;
        }
        if let Some(status) = status {
            rice_batch.status = status;
        }
        
        rice_batch.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Rice batch updated: {}", rice_batch.batch_number);
        Ok(())
    }

    // ============= CHAIN TRANSACTION METHODS =============
    
    pub fn create_chain_transaction(
        ctx: Context<CreateChainTransaction>,
        transaction_type: String,
        from_actor_id: Option<Pubkey>,
        to_actor_id: Option<Pubkey>,
        amount: u64,
        description: String,
        metadata: Option<String>,
    ) -> Result<()> {
        let chain_transaction = &mut ctx.accounts.chain_transaction;
        
        chain_transaction.transaction_type = transaction_type;
        chain_transaction.from_actor_id = from_actor_id;
        chain_transaction.to_actor_id = to_actor_id;
        chain_transaction.amount = amount;
        chain_transaction.description = description;
        chain_transaction.metadata = metadata;
        chain_transaction.status = "pending".to_string();
        chain_transaction.timestamp = Clock::get()?.unix_timestamp;
        chain_transaction.created_at = Clock::get()?.unix_timestamp;
        chain_transaction.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Chain transaction created: {}", chain_transaction.transaction_type);
        Ok(())
    }

    pub fn update_chain_transaction(
        ctx: Context<UpdateChainTransaction>,
        status: Option<String>,
        metadata: Option<String>,
    ) -> Result<()> {
        let chain_transaction = &mut ctx.accounts.chain_transaction;
        
        if let Some(status) = status {
            chain_transaction.status = status;
        }
        if let Some(metadata) = metadata {
            chain_transaction.metadata = Some(metadata);
        }
        
        chain_transaction.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Chain transaction updated: {}", chain_transaction.transaction_type);
        Ok(())
    }
}

// ============= DATA STRUCTURES =============

#[account]
#[derive(Default)]
pub struct ChainActor {
    pub discriminator: [u8; 8],
    pub name: String,
    pub actor_type: String,
    pub farm_id: Option<u64>,
    pub farmer_id: Option<u64>,
    pub assigned_tps: u64,
    pub organization: Option<Organization>,
    pub province_id: Option<u64>,
    pub city_id: Option<u64>,
    pub address: String,
    pub is_active: bool,
    pub balance: u64,
    pub pin: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl ChainActor {
    pub const DISCRIMINATOR: [u8; 8] = [1, 0, 0, 0, 0, 0, 0, 0];
    pub const LEN: usize = 8 + // discriminator
        4 + 64 + // name (max 64 chars)
        4 + 32 + // actor_type (max 32 chars)
        9 + // farm_id (1 + 8)
        9 + // farmer_id (1 + 8)
        8 + // assigned_tps
        1 + 4 + 64 + 4 + 32 + 4 + 64 + // organization (optional)
        9 + // province_id (1 + 8)
        9 + // city_id (1 + 8)
        4 + 128 + // address (max 128 chars)
        1 + // is_active
        8 + // balance
        1 + 4 + 32 + // pin (optional, max 32 chars)
        8 + // created_at
        8; // updated_at
}

#[account]
#[derive(Default)]
pub struct ProductionSeason {
    pub discriminator: [u8; 8],
    pub name: String,
    pub start_date: i64,
    pub end_date: i64,
    pub description: Option<String>,
    pub is_active: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

impl ProductionSeason {
    pub const DISCRIMINATOR: [u8; 8] = [2, 0, 0, 0, 0, 0, 0, 0];
    pub const LEN: usize = 8 + // discriminator
        4 + 64 + // name (max 64 chars)
        8 + // start_date
        8 + // end_date
        1 + 4 + 256 + // description (optional, max 256 chars)
        1 + // is_active
        8 + // created_at
        8; // updated_at
}

#[account]
#[derive(Default)]
pub struct MilledRice {
    pub discriminator: [u8; 8],
    pub variety: String,
    pub grade: String,
    pub quantity_kg: u64,
    pub milling_date: i64,
    pub expiry_date: Option<i64>,
    pub storage_location: String,
    pub is_available: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

impl MilledRice {
    pub const DISCRIMINATOR: [u8; 8] = [3, 0, 0, 0, 0, 0, 0, 0];
    pub const LEN: usize = 8 + // discriminator
        4 + 32 + // variety (max 32 chars)
        4 + 16 + // grade (max 16 chars)
        8 + // quantity_kg
        8 + // milling_date
        9 + // expiry_date (optional)
        4 + 128 + // storage_location (max 128 chars)
        1 + // is_available
        8 + // created_at
        8; // updated_at
}

#[account]
#[derive(Default)]
pub struct RiceBatch {
    pub discriminator: [u8; 8],
    pub batch_number: String,
    pub variety: String,
    pub quantity_kg: u64,
    pub harvest_date: i64,
    pub farmer_id: u64,
    pub farm_location: String,
    pub quality_grade: String,
    pub status: String,
    pub created_at: i64,
    pub updated_at: i64,
}

impl RiceBatch {
    pub const DISCRIMINATOR: [u8; 8] = [4, 0, 0, 0, 0, 0, 0, 0];
    pub const LEN: usize = 8 + // discriminator
        4 + 32 + // batch_number (max 32 chars)
        4 + 32 + // variety (max 32 chars)
        8 + // quantity_kg
        8 + // harvest_date
        8 + // farmer_id
        4 + 128 + // farm_location (max 128 chars)
        4 + 16 + // quality_grade (max 16 chars)
        4 + 32 + // status (max 32 chars)
        8 + // created_at
        8; // updated_at
}

#[account]
#[derive(Default)]
pub struct ChainTransaction {
    pub discriminator: [u8; 8],
    pub transaction_type: String,
    pub from_actor_id: Option<Pubkey>,
    pub to_actor_id: Option<Pubkey>,
    pub amount: u64,
    pub description: String,
    pub metadata: Option<String>,
    pub status: String,
    pub timestamp: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

impl ChainTransaction {
    pub const DISCRIMINATOR: [u8; 8] = [5, 0, 0, 0, 0, 0, 0, 0];
    pub const LEN: usize = 8 + // discriminator
        4 + 32 + // transaction_type (max 32 chars)
        1 + 32 + // from_actor_id (optional)
        1 + 32 + // to_actor_id (optional)
        8 + // amount
        4 + 256 + // description (max 256 chars)
        1 + 4 + 512 + // metadata (optional, max 512 chars)
        4 + 32 + // status (max 32 chars)
        8 + // timestamp
        8 + // created_at
        8; // updated_at
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Organization {
    pub name: String,
    pub org_type: String,
    pub contact_info: Option<String>,
}

// ============= ACCOUNT CONTEXTS =============

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateChainActor<'info> {
    #[account(
        init,
        payer = user,
        space = ChainActor::LEN
    )]
    pub chain_actor: Account<'info, ChainActor>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateChainActor<'info> {
    #[account(mut)]
    pub chain_actor: Account<'info, ChainActor>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateProductionSeason<'info> {
    #[account(
        init,
        payer = user,
        space = ProductionSeason::LEN
    )]
    pub production_season: Account<'info, ProductionSeason>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProductionSeason<'info> {
    #[account(mut)]
    pub production_season: Account<'info, ProductionSeason>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(variety: String)]
pub struct CreateMilledRice<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 100 + 1 + 8 + 8
    )]
    pub milled_rice: Account<'info, MilledRice>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMilledRice<'info> {
    #[account(mut)]
    pub milled_rice: Account<'info, MilledRice>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(batch_number: String)]
pub struct CreateRiceBatch<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 100 + 32 + 32 + 8 + 8
    )]
    pub rice_batch: Account<'info, RiceBatch>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRiceBatch<'info> {
    #[account(mut)]
    pub rice_batch: Account<'info, RiceBatch>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(transaction_type: String)]
pub struct CreateChainTransaction<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 32 + 8 + 200 + 200 + 32 + 8 + 8 + 8
    )]
    pub chain_transaction: Account<'info, ChainTransaction>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateChainTransaction<'info> {
    #[account(mut)]
    pub chain_transaction: Account<'info, ChainTransaction>,
    pub user: Signer<'info>,
}
