use anchor_lang::prelude::*;

declare_id!("816ZRCrPkSAzEyoPvvLiKcfJhvFkqPknK1JeM8MEtgR8");

#[program]
pub mod rice_supply_chain {
    use super::*;

    // Chain Actor Instructions
    pub fn create_chain_actor(
        ctx: Context<CreateChainActor>,
        name: String,
        actor_type: Vec<String>,
        farm_id: Option<Pubkey>,
        farmer_id: Option<Pubkey>,
        assigned_tps: u64,
        pin: String,
        organization: Organization,
        address: Option<String>,
    ) -> Result<()> {
        let chain_actor = &mut ctx.accounts.chain_actor;
        let clock = Clock::get()?;
        let public_key = chain_actor.key();
        
        chain_actor.public_key = public_key;
        chain_actor.name = name;
        chain_actor.actor_type = actor_type;
        chain_actor.farm_id = farm_id;
        chain_actor.farmer_id = farmer_id;
        chain_actor.assigned_tps = assigned_tps;
        chain_actor.is_active = true;
        chain_actor.balance = 0;
        chain_actor.pin = pin;
        chain_actor.organization = organization;
        chain_actor.address = address;
        chain_actor.created_at = clock.unix_timestamp;
        chain_actor.updated_at = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn update_chain_actor(
        ctx: Context<UpdateChainActor>,
        name: Option<String>,
        actor_type: Option<Vec<String>>,
        farm_id: Option<Pubkey>,
        farmer_id: Option<Pubkey>,
        assigned_tps: Option<u64>,
        pin: Option<String>,
        organization: Option<Organization>,
        address: Option<String>,
        is_active: Option<bool>,
        balance: Option<u64>,
    ) -> Result<()> {
        let chain_actor = &mut ctx.accounts.chain_actor;
        let clock = Clock::get()?;
        
        if let Some(name) = name {
            chain_actor.name = name;
        }
        if let Some(actor_type) = actor_type {
            chain_actor.actor_type = actor_type;
        }
        if let Some(farm_id) = farm_id {
            chain_actor.farm_id = Some(farm_id);
        }
        if let Some(farmer_id) = farmer_id {
            chain_actor.farmer_id = Some(farmer_id);
        }
        if let Some(assigned_tps) = assigned_tps {
            chain_actor.assigned_tps = assigned_tps;
        }
        if let Some(pin) = pin {
            chain_actor.pin = pin;
        }
        if let Some(organization) = organization {
            chain_actor.organization = organization;
        }
        if let Some(address) = address {
            chain_actor.address = Some(address);
        }
        if let Some(is_active) = is_active {
            chain_actor.is_active = is_active;
        }
        if let Some(balance) = balance {
            chain_actor.balance = balance;
        }
        
        chain_actor.updated_at = clock.unix_timestamp;
        Ok(())
    }

    pub fn delete_chain_actor(ctx: Context<DeleteChainActor>) -> Result<()> {
        let chain_actor = &mut ctx.accounts.chain_actor;
        chain_actor.is_active = false;
        Ok(())
    }

    // Production Season Instructions
    pub fn create_production_season(
        ctx: Context<CreateProductionSeason>,
        farmer_id: Pubkey,
        crop_year: String,
        processed_yield_kg: u64,
        variety: Option<String>,
        planned_practice: Option<String>,
        planting_date: Option<i64>,
        irrigation_practice: Option<String>,
        fertilizer_used: Option<String>,
        pesticide_used: Option<String>,
        harvest_date: Option<i64>,
        total_yield_kg: Option<u64>,
        moisture_content: Option<u32>,
        carbon_smart_certified: bool,
    ) -> Result<()> {
        let production_season = &mut ctx.accounts.production_season;
        let clock = Clock::get()?;
        let public_key = production_season.key();
        
        production_season.public_key = public_key;
        production_season.farmer_id = farmer_id;
        production_season.crop_year = crop_year;
        production_season.processed_yield_kg = processed_yield_kg;
        production_season.variety = variety;
        production_season.planned_practice = planned_practice;
        production_season.planting_date = planting_date;
        production_season.irrigation_practice = irrigation_practice;
        production_season.fertilizer_used = fertilizer_used;
        production_season.pesticide_used = pesticide_used;
        production_season.harvest_date = harvest_date;
        production_season.total_yield_kg = total_yield_kg;
        production_season.moisture_content = moisture_content;
        production_season.carbon_smart_certified = carbon_smart_certified;
        production_season.validation_status = ValidationStatus::Pending;
        production_season.validator_id = None;
        production_season.created_at = clock.unix_timestamp;
        production_season.updated_at = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn update_production_season(
        ctx: Context<UpdateProductionSeason>,
        crop_year: Option<String>,
        processed_yield_kg: Option<u64>,
        variety: Option<String>,
        planned_practice: Option<String>,
        planting_date: Option<i64>,
        irrigation_practice: Option<String>,
        fertilizer_used: Option<String>,
        pesticide_used: Option<String>,
        harvest_date: Option<i64>,
        total_yield_kg: Option<u64>,
        moisture_content: Option<u32>,
        carbon_smart_certified: Option<bool>,
        validation_status: Option<ValidationStatus>,
        validator_id: Option<Pubkey>,
    ) -> Result<()> {
        let production_season = &mut ctx.accounts.production_season;
        let clock = Clock::get()?;
        
        if let Some(crop_year) = crop_year {
            production_season.crop_year = crop_year;
        }
        if let Some(processed_yield_kg) = processed_yield_kg {
            production_season.processed_yield_kg = processed_yield_kg;
        }
        if let Some(variety) = variety {
            production_season.variety = Some(variety);
        }
        if let Some(planned_practice) = planned_practice {
            production_season.planned_practice = Some(planned_practice);
        }
        if let Some(planting_date) = planting_date {
            production_season.planting_date = Some(planting_date);
        }
        if let Some(irrigation_practice) = irrigation_practice {
            production_season.irrigation_practice = Some(irrigation_practice);
        }
        if let Some(fertilizer_used) = fertilizer_used {
            production_season.fertilizer_used = Some(fertilizer_used);
        }
        if let Some(pesticide_used) = pesticide_used {
            production_season.pesticide_used = Some(pesticide_used);
        }
        if let Some(harvest_date) = harvest_date {
            production_season.harvest_date = Some(harvest_date);
        }
        if let Some(total_yield_kg) = total_yield_kg {
            production_season.total_yield_kg = Some(total_yield_kg);
        }
        if let Some(moisture_content) = moisture_content {
            production_season.moisture_content = Some(moisture_content);
        }
        if let Some(carbon_smart_certified) = carbon_smart_certified {
            production_season.carbon_smart_certified = carbon_smart_certified;
        }
        if let Some(validation_status) = validation_status {
            production_season.validation_status = validation_status;
        }
        if let Some(validator_id) = validator_id {
            production_season.validator_id = Some(validator_id);
        }
        
        production_season.updated_at = clock.unix_timestamp;
        Ok(())
    }

    pub fn delete_production_season(ctx: Context<DeleteProductionSeason>) -> Result<()> {
        let production_season = &mut ctx.accounts.production_season;
        production_season.validation_status = ValidationStatus::Rejected;
        Ok(())
    }

    // Milled Rice Instructions
    pub fn create_milled_rice(
        ctx: Context<CreateMilledRice>,
        farmer_id: Pubkey,
        total_weight_kg: String,
        milling_type: String,
        quality: String,
        photo_urls: Vec<String>,
        moisture: u32,
        total_weight_processed_kg: u32,
    ) -> Result<()> {
        let milled_rice = &mut ctx.accounts.milled_rice;
        let clock = Clock::get()?;
        let public_key = milled_rice.key();
        
        milled_rice.public_key = public_key;
        milled_rice.farmer_id = farmer_id;
        milled_rice.total_weight_kg = total_weight_kg;
        milled_rice.milling_type = milling_type;
        milled_rice.quality = quality;
        milled_rice.photo_urls = photo_urls;
        milled_rice.moisture = moisture;
        milled_rice.total_weight_processed_kg = total_weight_processed_kg;
        milled_rice.created_at = clock.unix_timestamp;
        milled_rice.updated_at = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn update_milled_rice(
        ctx: Context<UpdateMilledRice>,
        total_weight_kg: Option<String>,
        milling_type: Option<String>,
        quality: Option<String>,
        photo_urls: Option<Vec<String>>,
        moisture: Option<u32>,
        total_weight_processed_kg: Option<u32>,
    ) -> Result<()> {
        let milled_rice = &mut ctx.accounts.milled_rice;
        let clock = Clock::get()?;
        
        if let Some(total_weight_kg) = total_weight_kg {
            milled_rice.total_weight_kg = total_weight_kg;
        }
        if let Some(milling_type) = milling_type {
            milled_rice.milling_type = milling_type;
        }
        if let Some(quality) = quality {
            milled_rice.quality = quality;
        }
        if let Some(photo_urls) = photo_urls {
            milled_rice.photo_urls = photo_urls;
        }
        if let Some(moisture) = moisture {
            milled_rice.moisture = moisture;
        }
        if let Some(total_weight_processed_kg) = total_weight_processed_kg {
            milled_rice.total_weight_processed_kg = total_weight_processed_kg;
        }
        
        milled_rice.updated_at = clock.unix_timestamp;
        Ok(())
    }

    // Rice Batch Instructions
    pub fn create_rice_batch(
        ctx: Context<CreateRiceBatch>,
        milled_rice_id: Pubkey,
        batch_status: BatchStatus,
        quality_score: u32,
        weight_kg: u32,
        qr_code: String,
    ) -> Result<()> {
        let rice_batch = &mut ctx.accounts.rice_batch;
        let clock = Clock::get()?;
        let public_key = rice_batch.key();
        
        rice_batch.public_key = public_key;
        rice_batch.milled_rice_id = milled_rice_id;
        rice_batch.batch_status = batch_status;
        rice_batch.quality_score = quality_score;
        rice_batch.weight_kg = weight_kg;
        rice_batch.qr_code = qr_code;
        rice_batch.created_at = clock.unix_timestamp;
        rice_batch.updated_at = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn update_rice_batch(
        ctx: Context<UpdateRiceBatch>,
        batch_status: Option<BatchStatus>,
        quality_score: Option<u32>,
        weight_kg: Option<u32>,
        qr_code: Option<String>,
    ) -> Result<()> {
        let rice_batch = &mut ctx.accounts.rice_batch;
        let clock = Clock::get()?;
        
        if let Some(batch_status) = batch_status {
            rice_batch.batch_status = batch_status;
        }
        if let Some(quality_score) = quality_score {
            rice_batch.quality_score = quality_score;
        }
        if let Some(weight_kg) = weight_kg {
            rice_batch.weight_kg = weight_kg;
        }
        if let Some(qr_code) = qr_code {
            rice_batch.qr_code = qr_code;
        }
        
        rice_batch.updated_at = clock.unix_timestamp;
        Ok(())
    }

    pub fn delete_rice_batch(ctx: Context<DeleteRiceBatch>) -> Result<()> {
        let rice_batch = &mut ctx.accounts.rice_batch;
        rice_batch.batch_status = BatchStatus::Consumed;
        Ok(())
    }

    // Chain Transaction Instructions
    pub fn create_chain_transaction(
        ctx: Context<CreateChainTransaction>,
        from_actor_id: Pubkey,
        to_actor_id: Pubkey,
        rice_batch_ids: Vec<Pubkey>,
        amount: u64,
        payment_method: PaymentMethod,
        payment_reference: Option<String>,
        geotag_latitude: Option<String>,
        geotag_longitude: Option<String>,
        quality: Option<String>,
    ) -> Result<()> {
        let chain_transaction = &mut ctx.accounts.chain_transaction;
        let clock = Clock::get()?;
        let public_key = chain_transaction.key();
        
        chain_transaction.public_key = public_key;
        chain_transaction.from_actor_id = from_actor_id;
        chain_transaction.to_actor_id = to_actor_id;
        chain_transaction.rice_batch_ids = rice_batch_ids;
        chain_transaction.amount = amount;
        chain_transaction.payment_method = payment_method;
        chain_transaction.payment_reference = payment_reference;
        chain_transaction.geotag_latitude = geotag_latitude;
        chain_transaction.geotag_longitude = geotag_longitude;
        chain_transaction.quality = quality;
        chain_transaction.transaction_status = TransactionStatus::Pending;
        chain_transaction.created_at = clock.unix_timestamp;
        chain_transaction.updated_at = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn update_chain_transaction(
        ctx: Context<UpdateChainTransaction>,
        amount: Option<u64>,
        payment_method: Option<PaymentMethod>,
        payment_reference: Option<String>,
        geotag_latitude: Option<String>,
        geotag_longitude: Option<String>,
        quality: Option<String>,
        transaction_status: Option<TransactionStatus>,
    ) -> Result<()> {
        let chain_transaction = &mut ctx.accounts.chain_transaction;
        let clock = Clock::get()?;
        
        if let Some(amount) = amount {
            chain_transaction.amount = amount;
        }
        if let Some(payment_method) = payment_method {
            chain_transaction.payment_method = payment_method;
        }
        if let Some(payment_reference) = payment_reference {
            chain_transaction.payment_reference = Some(payment_reference);
        }
        if let Some(geotag_latitude) = geotag_latitude {
            chain_transaction.geotag_latitude = Some(geotag_latitude);
        }
        if let Some(geotag_longitude) = geotag_longitude {
            chain_transaction.geotag_longitude = Some(geotag_longitude);
        }
        if let Some(quality) = quality {
            chain_transaction.quality = Some(quality);
        }
        if let Some(transaction_status) = transaction_status {
            chain_transaction.transaction_status = transaction_status;
        }
        
        chain_transaction.updated_at = clock.unix_timestamp;
        Ok(())
    }

    pub fn delete_chain_transaction(ctx: Context<DeleteChainTransaction>) -> Result<()> {
        let chain_transaction = &mut ctx.accounts.chain_transaction;
        chain_transaction.transaction_status = TransactionStatus::Cancelled;
        Ok(())
    }
}

// Account Structures
#[account]
pub struct ChainActor {
    pub public_key: Pubkey,
    pub name: String,
    pub actor_type: Vec<String>,
    pub farm_id: Option<Pubkey>,
    pub farmer_id: Option<Pubkey>,
    pub assigned_tps: u64,
    pub is_active: bool,
    pub balance: u64,
    pub pin: String,
    pub organization: Organization,
    pub address: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct ProductionSeason {
    pub public_key: Pubkey,
    pub farmer_id: Pubkey,
    pub crop_year: String,
    pub processed_yield_kg: u64,
    pub variety: Option<String>,
    pub planned_practice: Option<String>,
    pub planting_date: Option<i64>,
    pub irrigation_practice: Option<String>,
    pub fertilizer_used: Option<String>,
    pub pesticide_used: Option<String>,
    pub harvest_date: Option<i64>,
    pub total_yield_kg: Option<u64>,
    pub moisture_content: Option<u32>,
    pub carbon_smart_certified: bool,
    pub validation_status: ValidationStatus,
    pub validator_id: Option<Pubkey>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct MilledRice {
    pub public_key: Pubkey,
    pub farmer_id: Pubkey,
    pub total_weight_kg: String,
    pub milling_type: String,
    pub quality: String,
    pub photo_urls: Vec<String>,
    pub moisture: u32,
    pub total_weight_processed_kg: u32,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct RiceBatch {
    pub public_key: Pubkey,
    pub milled_rice_id: Pubkey,
    pub batch_status: BatchStatus,
    pub quality_score: u32,
    pub weight_kg: u32,
    pub qr_code: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct ChainTransaction {
    pub public_key: Pubkey,
    pub from_actor_id: Pubkey,
    pub to_actor_id: Pubkey,
    pub rice_batch_ids: Vec<Pubkey>,
    pub amount: u64,
    pub payment_method: PaymentMethod,
    pub payment_reference: Option<String>,
    pub geotag_latitude: Option<String>,
    pub geotag_longitude: Option<String>,
    pub quality: Option<String>,
    pub transaction_status: TransactionStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Organization {
    Farmer,
    Miller,
    Distributor,
    Retailer,
    Government,
    Cooperative,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ValidationStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BatchStatus {
    Created,
    InTransit,
    Delivered,
    Consumed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentMethod {
    Cash,
    BankTransfer,
    DigitalWallet,
    Cryptocurrency,
    Credit,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
    Cancelled,
}

// Context Structs
#[derive(Accounts)]
pub struct CreateChainActor<'info> {
    #[account(init, payer = user, space = 8 + 32 + 64 + 128 + 32 + 32 + 8 + 1 + 8 + 64 + 1 + 64 + 8 + 8)]
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
pub struct DeleteChainActor<'info> {
    #[account(mut)]
    pub chain_actor: Account<'info, ChainActor>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateProductionSeason<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 64 + 8 + 64 + 64 + 8 + 64 + 64 + 64 + 8 + 8 + 4 + 1 + 1 + 32 + 8 + 8)]
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
pub struct DeleteProductionSeason<'info> {
    #[account(mut)]
    pub production_season: Account<'info, ProductionSeason>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateMilledRice<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 64 + 64 + 64 + 128 + 4 + 4 + 8 + 8)]
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
pub struct CreateRiceBatch<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 1 + 4 + 4 + 64 + 8 + 8)]
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
pub struct DeleteRiceBatch<'info> {
    #[account(mut)]
    pub rice_batch: Account<'info, RiceBatch>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateChainTransaction<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 32 + 128 + 8 + 1 + 64 + 64 + 64 + 64 + 1 + 8 + 8)]
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

#[derive(Accounts)]
pub struct DeleteChainTransaction<'info> {
    #[account(mut)]
    pub chain_transaction: Account<'info, ChainTransaction>,
    pub user: Signer<'info>,
}
