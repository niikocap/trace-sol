const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet, BN } = require('@coral-xyz/anchor');
const bs58 = require('bs58');
const fs = require('fs');
const { logger } = require('../utils/helpers');

class SolanaService {
  constructor() {
    // In-memory storage for mock data
    this.mockData = {
      chainActors: [],
      productionSeasons: [],
      milledRice: [],
      riceBatches: [],
      chainTransactions: []
    };

    // Load existing data from files
    this.loadFromFile();
    
    try {
      const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      this.connection = new Connection(rpcUrl, 'confirmed');
      this.programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
      
      // Initialize wallet from private key
      if (process.env.SOLANA_WALLET_PRIVATE_KEY) {
        try {
          // Check if it's a file path or direct private key
          if (process.env.SOLANA_WALLET_PRIVATE_KEY.startsWith('/') || process.env.SOLANA_WALLET_PRIVATE_KEY.includes('.json')) {
            // Read keypair from file
            const keypairFile = fs.readFileSync(process.env.SOLANA_WALLET_PRIVATE_KEY, 'utf8');
            const keypairData = JSON.parse(keypairFile);
            this.wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(keypairData)));
          } else {
            // Decode base58 private key
            const privateKeyBytes = bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY);
            this.wallet = new Wallet(Keypair.fromSecretKey(privateKeyBytes));
          }
        } catch (error) {
          logger.error('Failed to load wallet:', error);
          this.wallet = new Wallet(Keypair.generate());
          logger.warn('Using generated keypair instead');
        }
      } else {
        // Generate a new keypair for development
        this.wallet = new Wallet(Keypair.generate());
        logger.warn('No wallet private key provided, using generated keypair');
      }
      
      this.provider = new AnchorProvider(this.connection, this.wallet, {
        commitment: 'confirmed'
      });
      
      // For now, we'll use raw Solana transactions instead of Anchor Program
      // This allows us to interact with the blockchain directly
      this.program = null; // Disable Anchor program for now
      logger.info('Solana service initialized with direct blockchain access (no Anchor program)');
      
      // Test connection to devnet asynchronously
      this.testConnection();
    } catch (error) {
      logger.error('Failed to initialize Solana service:', error);
      // Initialize with minimal setup for development
      this.connection = null;
      this.program = null;
      this.wallet = null;
      this.provider = null;
    }
  }

  async testConnection() {
    try {
      const balance = await this.connection.getBalance(this.wallet.publicKey);
      logger.info(`Wallet balance: ${balance / 1e9} SOL`);
    } catch (error) {
      logger.error('Failed to test Solana connection:', error);
    }
  }

  convertToLegacyIdl(newIdl) {
    // Convert new Anchor IDL format to legacy format
    const legacyIdl = {
      version: newIdl.metadata?.version || "0.1.0",
      name: newIdl.metadata?.name || "rice_supply_chain",
      instructions: [],
      accounts: [],
      types: []
    };

    // Convert instructions
    if (newIdl.instructions) {
      legacyIdl.instructions = newIdl.instructions.map(instruction => ({
        name: instruction.name,
        accounts: instruction.accounts || [],
        args: instruction.args || []
      }));
    }

    // Convert accounts
    if (newIdl.accounts) {
      legacyIdl.accounts = newIdl.accounts.map(account => ({
        name: account.name,
        type: {
          kind: "struct",
          fields: account.type?.fields || []
        }
      }));
    }

    // Convert types
    if (newIdl.types) {
      legacyIdl.types = newIdl.types.map(type => ({
        name: type.name,
        type: {
          kind: "struct", 
          fields: type.type?.fields || []
        }
      }));
    }

    return legacyIdl;
  }

  saveToFile(entityType, data) {
    try {
      const filePath = path.join(this.dataDir, `${entityType}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      logger.info(`Saved ${data.length} ${entityType} to file`);
    } catch (error) {
      logger.error(`Error saving ${entityType} to file:`, error);
    }
  }

  loadFromFile() {
    try {
      const types = ['chainActors', 'productionSeasons', 'milledRice', 'riceBatches', 'chainTransactions'];
      for (const type of types) {
        try {
          const filePath = `./data/${type}.json`;
          if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            this.mockData[type] = data;
            logger.info(`Loaded ${data.length} ${type} from file`);
          }
        } catch (error) {
          logger.warn(`Failed to load ${type} from file:`, error.message);
        }
      }
    } catch (error) {
      logger.error('Failed to load data from files:', error);
    }
  }

  // Chain Actor Methods
  async createChainActor(data) {
    try {
      if (!this.connection) {
        // Fallback to mock if no connection
        const mockPublicKey = Keypair.generate().publicKey.toString();
        const mockActor = {
          publicKey: mockPublicKey,
          name: data.name,
          actorType: data.actorType,
          assignedTps: data.assignedTps,
          isActive: true,
          balance: 0,
          pin: data.pin,
          organization: data.organization,
          address: data.address,
          farmId: data.farmId,
          farmerId: data.farmerId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockData.chainActors.push(mockActor);
        logger.info(`Mock chain actor created: ${mockPublicKey}`);
        return {
          publicKey: mockPublicKey,
          transaction: 'mock-transaction-signature'
        };
      }

      // For now, create blockchain transaction but store in mock data with blockchain reference
      const chainActorKeypair = Keypair.generate();
      
      // Create a simple transfer transaction as proof of blockchain interaction
      const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
      const transferTx = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: chainActorKeypair.publicKey,
        lamports: 1000000 // 0.001 SOL as marker
      });

      const transaction = new Transaction().add(transferTx);
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer],
        { commitment: 'confirmed' }
      );

      // Store data with blockchain reference
      const blockchainActor = {
        publicKey: chainActorKeypair.publicKey.toString(),
        name: data.name,
        actorType: data.actorType,
        assignedTps: data.assignedTps,
        isActive: true,
        balance: 0,
        pin: data.pin,
        organization: data.organization,
        address: data.address,
        farmId: data.farmId,
        farmerId: data.farmerId,
        blockchainTx: signature,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in both mock data and a persistent file for demo purposes
      this.mockData.chainActors.push(blockchainActor);
      this.saveToFile('chainActors', this.mockData.chainActors);
      
      logger.info(`Chain actor created on blockchain: ${chainActorKeypair.publicKey.toString()}, tx: ${signature}`);
      return {
        publicKey: chainActorKeypair.publicKey.toString(),
        transaction: signature
      };
    } catch (error) {
      logger.error('Error creating chain actor:', error);
      throw error;
    }
  }

  async updateChainActor(publicKey, data) {
    try {
      if (!this.program) {
        logger.info(`Mock chain actor updated: ${publicKey}`);
        return { transaction: 'mock-update-transaction' };
      }
      
      const chainActorPubkey = new PublicKey(publicKey);
      
      const tx = await this.program.methods
        .updateChainActor(
          data.name || null,
          data.actorType || null,
          data.farmId ? new PublicKey(data.farmId) : null,
          data.farmerId ? new PublicKey(data.farmerId) : null,
          data.assignedTps ? new BN(data.assignedTps) : null,
          data.isActive !== undefined ? data.isActive : null,
          data.balance ? new BN(data.balance) : null,
          data.pin || null,
          data.organization || null,
          data.address || null
        )
        .accounts({
          chainActor: chainActorPubkey,
          user: this.wallet.publicKey,
        })
        .rpc();

      logger.info(`Chain actor updated: ${publicKey}`);
      return { transaction: tx };
    } catch (error) {
      logger.error('Error updating chain actor:', error);
      throw error;
    }
  }

  async getChainActor(publicKey) {
    try {
      if (!this.connection) {
        const actor = this.mockData.chainActors.find(a => a.publicKey === publicKey);
        return actor || null;
      }

      // Retrieve account data from blockchain
      try {
        const accountInfo = await this.connection.getAccountInfo(new PublicKey(publicKey));
        if (!accountInfo) {
          return null;
        }

        const accountData = JSON.parse(accountInfo.data.toString());
        return {
          publicKey: publicKey,
          ...accountData,
          createdAt: new Date(accountData.createdAt),
          updatedAt: new Date(accountData.updatedAt)
        };
      } catch (blockchainError) {
        logger.warn(`Failed to retrieve from blockchain, checking mock data: ${blockchainError.message}`);
        const actor = this.mockData.chainActors.find(a => a.publicKey === publicKey);
        return actor || null;
      }
    } catch (error) {
      logger.error('Error fetching chain actor:', error);
      throw error;
    }
  }

  async getAllChainActors() {
    try {
      // Return stored data (includes blockchain-backed actors)
      return this.mockData.chainActors;
    } catch (error) {
      logger.error('Error fetching all chain actors:', error);
      throw error;
    }
  }

  // Production Season Methods
  async createProductionSeason(data) {
    try {
      if (!this.connection) {
        const mockPublicKey = Keypair.generate().publicKey.toString();
        const mockSeason = {
          publicKey: mockPublicKey,
          farmerId: data.farmerId,
          cropYear: data.cropYear,
          processedYieldKg: data.processedYieldKg,
          variety: data.variety,
          plannedPractice: data.plannedPractice,
          plantingDate: data.plantingDate ? new Date(data.plantingDate) : null,
          irrigationPractice: data.irrigationPractice,
          fertilizerUsed: data.fertilizerUsed,
          pesticideUsed: data.pesticideUsed,
          harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
          totalYieldKg: data.totalYieldKg,
          moistureContent: data.moistureContent,
          carbonSmartCertified: data.carbonSmartCertified,
          validationStatus: 'pending',
          validatorId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockData.productionSeasons.push(mockSeason);
        this.saveToFile('productionSeasons', this.mockData.productionSeasons);
        logger.info(`Mock production season created: ${mockPublicKey}`);
        return {
          publicKey: mockPublicKey,
          transaction: 'mock-transaction-signature'
        };
      }

      // Create blockchain transaction for production season
      const productionSeasonKeypair = Keypair.generate();
      
      // Create a simple transfer transaction as proof of blockchain interaction
      const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
      const transferTx = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: productionSeasonKeypair.publicKey,
        lamports: 1000000 // 0.001 SOL as marker
      });

      const transaction = new Transaction().add(transferTx);
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer],
        { commitment: 'confirmed' }
      );

      // Store data with blockchain reference
      const blockchainSeason = {
        publicKey: productionSeasonKeypair.publicKey.toString(),
        farmerId: data.farmerId,
        cropYear: data.cropYear,
        processedYieldKg: data.processedYieldKg,
        variety: data.variety,
        plannedPractice: data.plannedPractice,
        plantingDate: data.plantingDate ? new Date(data.plantingDate) : null,
        irrigationPractice: data.irrigationPractice,
        fertilizerUsed: data.fertilizerUsed,
        pesticideUsed: data.pesticideUsed,
        harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
        totalYieldKg: data.totalYieldKg,
        moistureContent: data.moistureContent,
        carbonSmartCertified: data.carbonSmartCertified,
        validationStatus: 'pending',
        validatorId: null,
        blockchainTx: signature,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in both mock data and persistent file
      this.mockData.productionSeasons.push(blockchainSeason);
      this.saveToFile('productionSeasons', this.mockData.productionSeasons);
      
      logger.info(`Production season created on blockchain: ${productionSeasonKeypair.publicKey.toString()}, tx: ${signature}`);
      return {
        publicKey: productionSeasonKeypair.publicKey.toString(),
        transaction: signature
      };
    } catch (error) {
      logger.error('Error creating production season:', error);
      throw error;
    }
  }

  async updateProductionSeason(publicKey, data) {
    try {
      if (!this.program) {
        logger.info(`Mock production season updated: ${publicKey}`);
        return { transaction: 'mock-update-transaction' };
      }
      
      const productionSeasonPubkey = new PublicKey(publicKey);
      
      const tx = await this.program.methods
        .updateProductionSeason(
          data.cropYear || null,
          data.processedYieldKg ? new BN(data.processedYieldKg) : null,
          data.variety || null,
          data.plannedPractice || null,
          data.plantingDate ? new BN(Math.floor(new Date(data.plantingDate).getTime() / 1000)) : null,
          data.irrigationPractice || null,
          data.fertilizerUsed || null,
          data.pesticideUsed || null,
          data.harvestDate ? new BN(Math.floor(new Date(data.harvestDate).getTime() / 1000)) : null,
          data.totalYieldKg ? new BN(data.totalYieldKg) : null,
          data.moistureContent || null,
          data.carbonSmartCertified !== undefined ? data.carbonSmartCertified : null,
          data.validationStatus || null,
          data.validatorId ? new PublicKey(data.validatorId) : null
        )
        .accounts({
          productionSeason: productionSeasonPubkey,
          user: this.wallet.publicKey,
        })
        .rpc();

      logger.info(`Production season updated: ${publicKey}`);
      return { transaction: tx };
    } catch (error) {
      logger.error('Error updating production season:', error);
      throw error;
    }
  }

  async getProductionSeason(publicKey) {
    try {
      if (!this.program) {
        const season = this.mockData.productionSeasons.find(s => s.publicKey === publicKey);
        return season || null;
      }
      
      const productionSeasonPubkey = new PublicKey(publicKey);
      const account = await this.program.account.productionSeason.fetch(productionSeasonPubkey);
      
      return {
        publicKey: publicKey,
        ...account,
        plantingDate: account.plantingDate ? new Date(account.plantingDate.toNumber() * 1000) : null,
        harvestDate: account.harvestDate ? new Date(account.harvestDate.toNumber() * 1000) : null,
        createdAt: new Date(account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.updatedAt.toNumber() * 1000)
      };
    } catch (error) {
      logger.error('Error fetching production season:', error);
      throw error;
    }
  }

  async getAllProductionSeasons() {
    try {
      // Return stored data (includes blockchain-backed seasons)
      return this.mockData.productionSeasons;
    } catch (error) {
      logger.error('Error fetching all production seasons:', error);
      throw error;
    }
  }

  // Milled Rice Methods
  async createMilledRice(data) {
    try {
      if (!this.connection) {
        const mockPublicKey = Keypair.generate().publicKey.toString();
        const mockMilledRice = {
          publicKey: mockPublicKey,
          farmerId: data.farmerId,
          totalWeightKg: data.totalWeightKg,
          millingType: data.millingType,
          quality: data.quality,
          photoUrls: data.photoUrls || [],
          moisture: data.moisture,
          totalWeightProcessedKg: data.totalWeightProcessedKg,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockData.milledRice.push(mockMilledRice);
        this.saveToFile('milledRice', this.mockData.milledRice);
        logger.info(`Mock milled rice created: ${mockPublicKey}`);
        return {
          publicKey: mockPublicKey,
          transaction: 'mock-transaction-signature'
        };
      }

      // Create blockchain transaction for milled rice
      const milledRiceKeypair = Keypair.generate();
      
      // Create a simple transfer transaction as proof of blockchain interaction
      const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
      const transferTx = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: milledRiceKeypair.publicKey,
        lamports: 1000000 // 0.001 SOL as marker
      });

      const transaction = new Transaction().add(transferTx);
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer],
        { commitment: 'confirmed' }
      );

      // Store data with blockchain reference
      const blockchainMilledRice = {
        publicKey: milledRiceKeypair.publicKey.toString(),
        farmerId: data.farmerId,
        totalWeightKg: data.totalWeightKg,
        millingType: data.millingType,
        quality: data.quality,
        photoUrls: data.photoUrls || [],
        moisture: data.moisture,
        totalWeightProcessedKg: data.totalWeightProcessedKg,
        blockchainTx: signature,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in both mock data and persistent file
      this.mockData.milledRice.push(blockchainMilledRice);
      this.saveToFile('milledRice', this.mockData.milledRice);
      
      logger.info(`Milled rice created on blockchain: ${milledRiceKeypair.publicKey.toString()}, tx: ${signature}`);
      return {
        publicKey: milledRiceKeypair.publicKey.toString(),
        transaction: signature
      };
    } catch (error) {
      logger.error('Error creating milled rice:', error);
      throw error;
    }
  }

  async updateMilledRice(publicKey, data) {
    try {
      if (!this.program) {
        logger.info(`Mock milled rice updated: ${publicKey}`);
        return { transaction: 'mock-update-transaction' };
      }
      
      const milledRicePubkey = new PublicKey(publicKey);
      
      const tx = await this.program.methods
        .updateMilledRice(
          data.totalWeightKg || null,
          data.millingType || null,
          data.quality || null,
          data.photoUrls || null,
          data.moisture || null,
          data.totalWeightProcessedKg || null
        )
        .accounts({
          milledRice: milledRicePubkey,
          user: this.wallet.publicKey,
        })
        .rpc();

      logger.info(`Milled rice updated: ${publicKey}`);
      return { transaction: tx };
    } catch (error) {
      logger.error('Error updating milled rice:', error);
      throw error;
    }
  }

  async getMilledRice(publicKey) {
    try {
      if (!this.program) {
        const milledRice = this.mockData.milledRice.find(m => m.publicKey === publicKey);
        return milledRice || null;
      }
      
      const milledRicePubkey = new PublicKey(publicKey);
      const account = await this.program.account.milledRice.fetch(milledRicePubkey);
      
      return {
        publicKey: publicKey,
        ...account,
        createdAt: new Date(account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.updatedAt.toNumber() * 1000)
      };
    } catch (error) {
      logger.error('Error fetching milled rice:', error);
      throw error;
    }
  }

  async getAllMilledRice() {
    try {
      // Return stored data (includes blockchain-backed milled rice)
      return this.mockData.milledRice;
    } catch (error) {
      logger.error('Error fetching all milled rice:', error);
      throw error;
    }
  }

  // Rice Batch Methods
  async createRiceBatch(data) {
    try {
      if (!this.connection) {
        const mockPublicKey = Keypair.generate().publicKey.toString();
        const mockBatch = {
          publicKey: mockPublicKey,
          qrCode: data.qrCode,
          millingId: data.millingId,
          batchWeightKg: data.batchWeightKg,
          moistureContent: data.moistureContent,
          seasonId: data.seasonId,
          currentHolderId: data.currentHolderId,
          pricePerKg: data.pricePerKg,
          dryingId: data.dryingId,
          validator: data.validator,
          status: data.status,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockData.riceBatches.push(mockBatch);
        this.saveToFile('riceBatches', this.mockData.riceBatches);
        logger.info(`Mock rice batch created: ${mockPublicKey}`);
        return {
          publicKey: mockPublicKey,
          transaction: 'mock-transaction-signature'
        };
      }

      // Create blockchain transaction for rice batch
      const riceBatchKeypair = Keypair.generate();
      
      // Create a simple transfer transaction as proof of blockchain interaction
      const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
      const transferTx = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: riceBatchKeypair.publicKey,
        lamports: 1000000 // 0.001 SOL as marker
      });

      const transaction = new Transaction().add(transferTx);
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer],
        { commitment: 'confirmed' }
      );

      // Store data with blockchain reference
      const blockchainBatch = {
        publicKey: riceBatchKeypair.publicKey.toString(),
        qrCode: data.qrCode,
        millingId: data.millingId,
        batchWeightKg: data.batchWeightKg,
        moistureContent: data.moistureContent,
        seasonId: data.seasonId,
        currentHolderId: data.currentHolderId,
        pricePerKg: data.pricePerKg,
        dryingId: data.dryingId,
        validator: data.validator,
        status: data.status,
        blockchainTx: signature,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in both mock data and persistent file
      this.mockData.riceBatches.push(blockchainBatch);
      this.saveToFile('riceBatches', this.mockData.riceBatches);
      
      logger.info(`Rice batch created on blockchain: ${riceBatchKeypair.publicKey.toString()}, tx: ${signature}`);
      return {
        publicKey: riceBatchKeypair.publicKey.toString(),
        transaction: signature
      };
    } catch (error) {
      logger.error('Error creating rice batch:', error);
      throw error;
    }
  }

  async updateRiceBatch(publicKey, data) {
    try {
      if (!this.program) {
        logger.info(`Mock rice batch updated: ${publicKey}`);
        return { transaction: 'mock-update-transaction' };
      }
      
      const riceBatchPubkey = new PublicKey(publicKey);
      
      const tx = await this.program.methods
        .updateRiceBatch(
          data.qrCode || null,
          data.millingId ? new PublicKey(data.millingId) : null,
          data.batchWeightKg ? new BN(data.batchWeightKg) : null,
          data.moistureContent || null,
          data.currentHolderId ? new PublicKey(data.currentHolderId) : null,
          data.pricePerKg ? new BN(data.pricePerKg) : null,
          data.dryingId ? new PublicKey(data.dryingId) : null,
          data.validator ? new PublicKey(data.validator) : null,
          data.status || null
        )
        .accounts({
          riceBatch: riceBatchPubkey,
          user: this.wallet.publicKey,
        })
        .rpc();

      logger.info(`Rice batch updated: ${publicKey}`);
      return { transaction: tx };
    } catch (error) {
      logger.error('Error updating rice batch:', error);
      throw error;
    }
  }

  async getRiceBatch(publicKey) {
    try {
      if (!this.program) {
        const batch = this.mockData.riceBatches.find(b => b.publicKey === publicKey);
        return batch || null;
      }
      
      const riceBatchPubkey = new PublicKey(publicKey);
      const account = await this.program.account.riceBatch.fetch(riceBatchPubkey);
      
      return {
        publicKey: publicKey,
        ...account,
        createdAt: new Date(account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.updatedAt.toNumber() * 1000)
      };
    } catch (error) {
      logger.error('Error fetching rice batch:', error);
      throw error;
    }
  }

  async getRiceBatchByQR(qrCode) {
    try {
      if (!this.program) {
        return null;
      }
      
      const accounts = await this.program.account.riceBatch.all([
        {
          memcmp: {
            offset: 8 + 32, // Skip discriminator and public_key
            bytes: Buffer.from(qrCode).toString('base64')
          }
        }
      ]);
      
      if (accounts.length === 0) {
        return null;
      }
      
      const account = accounts[0];
      return {
        publicKey: account.publicKey.toString(),
        ...account.account,
        createdAt: new Date(account.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.account.updatedAt.toNumber() * 1000)
      };
    } catch (error) {
      logger.error('Error fetching rice batch by QR:', error);
      throw error;
    }
  }

  async getAllRiceBatches() {
    try {
      // Return stored data (includes blockchain-backed rice batches)
      return this.mockData.riceBatches;
    } catch (error) {
      logger.error('Error fetching all rice batches:', error);
      throw error;
    }
  }

  // Chain Transaction Methods
  async createChainTransaction(data) {
    try {
      if (!this.connection) {
        const mockPublicKey = Keypair.generate().publicKey.toString();
        const mockTransaction = {
          publicKey: mockPublicKey,
          batchIds: data.batchIds || [],
          fromActorId: data.fromActorId,
          toActorId: data.toActorId,
          pricePerKg: data.pricePerKg,
          moisture: data.moisture,
          quality: data.quality,
          paymentReference: data.paymentReference,
          paymentMethod: data.paymentMethod,
          status: 'pending',
          geotagging: data.geotagging,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockData.chainTransactions.push(mockTransaction);
        this.saveToFile('chainTransactions', this.mockData.chainTransactions);
        logger.info(`Mock chain transaction created: ${mockPublicKey}`);
        return {
          publicKey: mockPublicKey,
          transaction: 'mock-transaction-signature'
        };
      }

      // Create blockchain transaction for chain transaction
      const chainTransactionKeypair = Keypair.generate();
      
      // Create a simple transfer transaction as proof of blockchain interaction
      const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
      const transferTx = SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: chainTransactionKeypair.publicKey,
        lamports: 1000000 // 0.001 SOL as marker
      });

      const transaction = new Transaction().add(transferTx);
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer],
        { commitment: 'confirmed' }
      );

      // Store data with blockchain reference
      const blockchainTransaction = {
        publicKey: chainTransactionKeypair.publicKey.toString(),
        batchIds: data.batchIds || [],
        fromActorId: data.fromActorId,
        toActorId: data.toActorId,
        pricePerKg: data.pricePerKg,
        moisture: data.moisture,
        quality: data.quality,
        paymentReference: data.paymentReference,
        paymentMethod: data.paymentMethod,
        status: 'pending',
        geotagging: data.geotagging,
        blockchainTx: signature,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in both mock data and persistent file
      this.mockData.chainTransactions.push(blockchainTransaction);
      this.saveToFile('chainTransactions', this.mockData.chainTransactions);
      
      logger.info(`Chain transaction created on blockchain: ${chainTransactionKeypair.publicKey.toString()}, tx: ${signature}`);
      return {
        publicKey: chainTransactionKeypair.publicKey.toString(),
        transaction: signature
      };
    } catch (error) {
      logger.error('Error creating chain transaction:', error);
      throw error;
    }
  }

  async updateChainTransaction(publicKey, data) {
    try {
      if (!this.program) {
        logger.info(`Mock chain transaction updated: ${publicKey}`);
        return { transaction: 'mock-update-transaction' };
      }
      
      const chainTransactionPubkey = new PublicKey(publicKey);
      
      const tx = await this.program.methods
        .updateChainTransaction(
          data.pricePerKg ? new BN(data.pricePerKg) : null,
          data.moisture || null,
          data.quality || null,
          data.paymentReference || null,
          data.paymentMethod || null,
          data.status || null,
          data.geotagging || null
        )
        .accounts({
          chainTransaction: chainTransactionPubkey,
          user: this.wallet.publicKey,
        })
        .rpc();

      logger.info(`Chain transaction updated: ${publicKey}`);
      return { transaction: tx };
    } catch (error) {
      logger.error('Error updating chain transaction:', error);
      throw error;
    }
  }

  async getChainTransaction(publicKey) {
    try {
      if (!this.program) {
        const transaction = this.mockData.chainTransactions.find(t => t.publicKey === publicKey);
        return transaction || null;
      }
      
      const chainTransactionPubkey = new PublicKey(publicKey);
      const account = await this.program.account.chainTransaction.fetch(chainTransactionPubkey);
      
      return {
        publicKey: publicKey,
        ...account,
        createdAt: new Date(account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.updatedAt.toNumber() * 1000)
      };
    } catch (error) {
      logger.error('Error fetching chain transaction:', error);
      throw error;
    }
  }

  async getAllChainTransactions() {
    try {
      // Return stored data (includes blockchain-backed chain transactions)
      return this.mockData.chainTransactions;
    } catch (error) {
      logger.error('Error fetching all chain transactions:', error);
      throw error;
    }
  }

  // Update methods
  async updateChainActor(publicKey, updateData) {
    try {
      const actorIndex = this.mockData.chainActors.findIndex(actor => actor.publicKey === publicKey);
      if (actorIndex === -1) {
        throw new Error('Chain actor not found');
      }

      // Update the actor data
      this.mockData.chainActors[actorIndex] = {
        ...this.mockData.chainActors[actorIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Save to file
      this.saveToFile('chainActors', this.mockData.chainActors);

      return this.mockData.chainActors[actorIndex];
    } catch (error) {
      logger.error('Error updating chain actor:', error);
      throw error;
    }
  }

  async updateProductionSeason(publicKey, updateData) {
    try {
      const seasonIndex = this.mockData.productionSeasons.findIndex(season => season.publicKey === publicKey);
      if (seasonIndex === -1) {
        throw new Error('Production season not found');
      }

      this.mockData.productionSeasons[seasonIndex] = {
        ...this.mockData.productionSeasons[seasonIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToFile('productionSeasons', this.mockData.productionSeasons);
      return this.mockData.productionSeasons[seasonIndex];
    } catch (error) {
      logger.error('Error updating production season:', error);
      throw error;
    }
  }

  async updateMilledRice(publicKey, updateData) {
    try {
      const milledRiceIndex = this.mockData.milledRice.findIndex(rice => rice.publicKey === publicKey);
      if (milledRiceIndex === -1) {
        throw new Error('Milled rice not found');
      }

      this.mockData.milledRice[milledRiceIndex] = {
        ...this.mockData.milledRice[milledRiceIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToFile('milledRice', this.mockData.milledRice);
      return this.mockData.milledRice[milledRiceIndex];
    } catch (error) {
      logger.error('Error updating milled rice:', error);
      throw error;
    }
  }

  async updateRiceBatch(publicKey, updateData) {
    try {
      const batchIndex = this.mockData.riceBatches.findIndex(batch => batch.publicKey === publicKey);
      if (batchIndex === -1) {
        throw new Error('Rice batch not found');
      }

      this.mockData.riceBatches[batchIndex] = {
        ...this.mockData.riceBatches[batchIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToFile('riceBatches', this.mockData.riceBatches);
      return this.mockData.riceBatches[batchIndex];
    } catch (error) {
      logger.error('Error updating rice batch:', error);
      throw error;
    }
  }

  async updateChainTransaction(publicKey, updateData) {
    try {
      const transactionIndex = this.mockData.chainTransactions.findIndex(tx => tx.publicKey === publicKey);
      if (transactionIndex === -1) {
        throw new Error('Chain transaction not found');
      }

      this.mockData.chainTransactions[transactionIndex] = {
        ...this.mockData.chainTransactions[transactionIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveToFile('chainTransactions', this.mockData.chainTransactions);
      return this.mockData.chainTransactions[transactionIndex];
    } catch (error) {
      logger.error('Error updating chain transaction:', error);
      throw error;
    }
  }

  // Delete methods (mark as inactive instead of actual deletion)
  async deleteChainActor(publicKey) {
    return this.updateChainActor(publicKey, { isActive: false });
  }

  async deleteProductionSeason(publicKey) {
    return this.updateProductionSeason(publicKey, { isActive: false });
  }

  async deleteMilledRice(publicKey) {
    return this.updateMilledRice(publicKey, { isActive: false });
  }

  async deleteRiceBatch(publicKey) {
    return this.updateRiceBatch(publicKey, { isActive: false });
  }

  async deleteChainTransaction(publicKey) {
    return this.updateChainTransaction(publicKey, { isActive: false });
  }
}

module.exports = new SolanaService();
