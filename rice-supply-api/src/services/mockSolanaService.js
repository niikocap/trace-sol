const { PublicKey, Keypair } = require('@solana/web3.js');
const { logger } = require('../utils/helpers');

class MockSolanaService {
  constructor() {
    // Mock storage for demo purposes
    this.chainActors = [];
    this.productionSeasons = [];
    this.milledRice = [];
    this.riceBatches = [];
    this.chainTransactions = [];
    
    logger.info('Mock Solana service initialized for demo');
  }

  // Chain Actor Methods
  async createChainActor(data) {
    try {
      const publicKey = Keypair.generate().publicKey.toString();
      
      const chainActor = {
        publicKey,
        name: data.name,
        actorType: data.actorType,
        farmId: data.farmId,
        farmerId: data.farmerId,
        assignedTps: data.assignedTps,
        isActive: true,
        balance: 0,
        pin: data.pin,
        organization: data.organization,
        address: data.address,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      this.chainActors.push(chainActor);
      logger.info(`Created chain actor: ${data.name} with key: ${publicKey}`);
      
      return {
        success: true,
        data: chainActor,
        signature: `mock_signature_${Date.now()}`
      };
    } catch (error) {
      logger.error('Error creating chain actor:', error);
      throw error;
    }
  }

  async getAllChainActors(page = 1, limit = 10) {
    try {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActors = this.chainActors.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          actors: paginatedActors,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(this.chainActors.length / limit),
            totalItems: this.chainActors.length,
            itemsPerPage: limit
          }
        }
      };
    } catch (error) {
      logger.error('Error getting chain actors:', error);
      throw error;
    }
  }

  async getChainActorByPublicKey(publicKey) {
    try {
      const actor = this.chainActors.find(a => a.publicKey === publicKey);
      if (!actor) {
        return { success: false, error: 'Chain actor not found' };
      }
      
      return { success: true, data: actor };
    } catch (error) {
      logger.error('Error getting chain actor:', error);
      throw error;
    }
  }

  async updateChainActor(publicKey, data) {
    try {
      const actorIndex = this.chainActors.findIndex(a => a.publicKey === publicKey);
      if (actorIndex === -1) {
        return { success: false, error: 'Chain actor not found' };
      }
      
      const updatedActor = {
        ...this.chainActors[actorIndex],
        ...data,
        updatedAt: Date.now()
      };
      
      this.chainActors[actorIndex] = updatedActor;
      logger.info(`Updated chain actor: ${publicKey}`);
      
      return {
        success: true,
        data: updatedActor,
        signature: `mock_signature_${Date.now()}`
      };
    } catch (error) {
      logger.error('Error updating chain actor:', error);
      throw error;
    }
  }

  async deleteChainActor(publicKey) {
    try {
      const actorIndex = this.chainActors.findIndex(a => a.publicKey === publicKey);
      if (actorIndex === -1) {
        return { success: false, error: 'Chain actor not found' };
      }
      
      // Mark as inactive instead of deleting
      this.chainActors[actorIndex].isActive = false;
      this.chainActors[actorIndex].updatedAt = Date.now();
      
      logger.info(`Deactivated chain actor: ${publicKey}`);
      
      return {
        success: true,
        signature: `mock_signature_${Date.now()}`
      };
    } catch (error) {
      logger.error('Error deleting chain actor:', error);
      throw error;
    }
  }

  // Production Season Methods (mock implementations)
  async createProductionSeason(data) {
    const publicKey = Keypair.generate().publicKey.toString();
    const season = {
      publicKey,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.productionSeasons.push(season);
    return { success: true, data: season, signature: `mock_signature_${Date.now()}` };
  }

  async getAllProductionSeasons(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSeasons = this.productionSeasons.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        seasons: paginatedSeasons,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(this.productionSeasons.length / limit),
          totalItems: this.productionSeasons.length,
          itemsPerPage: limit
        }
      }
    };
  }

  async getProductionSeasonByPublicKey(publicKey) {
    try {
      const season = this.productionSeasons.find(s => s.publicKey === publicKey);
      if (!season) {
        return { success: false, error: 'Production season not found' };
      }
      
      return { success: true, data: season };
    } catch (error) {
      logger.error('Error getting production season:', error);
      throw error;
    }
  }

  async updateProductionSeason(publicKey, data) {
    try {
      const seasonIndex = this.productionSeasons.findIndex(s => s.publicKey === publicKey);
      if (seasonIndex === -1) {
        return { success: false, error: 'Production season not found' };
      }
      
      this.productionSeasons[seasonIndex] = {
        ...this.productionSeasons[seasonIndex],
        ...data,
        updatedAt: Date.now()
      };
      
      return { success: true, data: this.productionSeasons[seasonIndex], signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error updating production season:', error);
      throw error;
    }
  }

  async deleteProductionSeason(publicKey) {
    try {
      const seasonIndex = this.productionSeasons.findIndex(s => s.publicKey === publicKey);
      if (seasonIndex === -1) {
        return { success: false, error: 'Production season not found' };
      }
      
      this.productionSeasons.splice(seasonIndex, 1);
      return { success: true, signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error deleting production season:', error);
      throw error;
    }
  }

  // Milled Rice Methods (mock implementations)
  async createMilledRice(data) {
    const publicKey = Keypair.generate().publicKey.toString();
    const rice = {
      publicKey,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.milledRice.push(rice);
    return { success: true, data: rice, signature: `mock_signature_${Date.now()}` };
  }

  async getAllMilledRice(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRice = this.milledRice.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        milledRice: paginatedRice,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(this.milledRice.length / limit),
          totalItems: this.milledRice.length,
          itemsPerPage: limit
        }
      }
    };
  }

  async getMilledRiceByPublicKey(publicKey) {
    try {
      const rice = this.milledRice.find(r => r.publicKey === publicKey);
      if (!rice) {
        return { success: false, error: 'Milled rice not found' };
      }
      
      return { success: true, data: rice };
    } catch (error) {
      logger.error('Error getting milled rice:', error);
      throw error;
    }
  }

  async updateMilledRice(publicKey, data) {
    try {
      const riceIndex = this.milledRice.findIndex(r => r.publicKey === publicKey);
      if (riceIndex === -1) {
        return { success: false, error: 'Milled rice not found' };
      }
      
      this.milledRice[riceIndex] = {
        ...this.milledRice[riceIndex],
        ...data,
        updatedAt: Date.now()
      };
      
      return { success: true, data: this.milledRice[riceIndex], signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error updating milled rice:', error);
      throw error;
    }
  }

  async deleteMilledRice(publicKey) {
    try {
      const riceIndex = this.milledRice.findIndex(r => r.publicKey === publicKey);
      if (riceIndex === -1) {
        return { success: false, error: 'Milled rice not found' };
      }
      
      this.milledRice.splice(riceIndex, 1);
      return { success: true, signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error deleting milled rice:', error);
      throw error;
    }
  }

  // Rice Batch Methods (mock implementations)
  async createRiceBatch(data) {
    const publicKey = Keypair.generate().publicKey.toString();
    const batch = {
      publicKey,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.riceBatches.push(batch);
    return { success: true, data: batch, signature: `mock_signature_${Date.now()}` };
  }

  async getAllRiceBatches(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBatches = this.riceBatches.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        batches: paginatedBatches,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(this.riceBatches.length / limit),
          totalItems: this.riceBatches.length,
          itemsPerPage: limit
        }
      }
    };
  }

  async getRiceBatchByPublicKey(publicKey) {
    try {
      const batch = this.riceBatches.find(b => b.publicKey === publicKey);
      if (!batch) {
        return { success: false, error: 'Rice batch not found' };
      }
      
      return { success: true, data: batch };
    } catch (error) {
      logger.error('Error getting rice batch:', error);
      throw error;
    }
  }

  async updateRiceBatch(publicKey, data) {
    try {
      const batchIndex = this.riceBatches.findIndex(b => b.publicKey === publicKey);
      if (batchIndex === -1) {
        return { success: false, error: 'Rice batch not found' };
      }
      
      this.riceBatches[batchIndex] = {
        ...this.riceBatches[batchIndex],
        ...data,
        updatedAt: Date.now()
      };
      
      return { success: true, data: this.riceBatches[batchIndex], signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error updating rice batch:', error);
      throw error;
    }
  }

  async deleteRiceBatch(publicKey) {
    try {
      const batchIndex = this.riceBatches.findIndex(b => b.publicKey === publicKey);
      if (batchIndex === -1) {
        return { success: false, error: 'Rice batch not found' };
      }
      
      this.riceBatches.splice(batchIndex, 1);
      return { success: true, signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error deleting rice batch:', error);
      throw error;
    }
  }

  // Chain Transaction Methods (mock implementations)
  async createChainTransaction(data) {
    const publicKey = Keypair.generate().publicKey.toString();
    const transaction = {
      publicKey,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.chainTransactions.push(transaction);
    return { success: true, data: transaction, signature: `mock_signature_${Date.now()}` };
  }

  async getAllChainTransactions(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = this.chainTransactions.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(this.chainTransactions.length / limit),
          totalItems: this.chainTransactions.length,
          itemsPerPage: limit
        }
      }
    };
  }

  async getChainTransactionByPublicKey(publicKey) {
    try {
      const transaction = this.chainTransactions.find(t => t.publicKey === publicKey);
      if (!transaction) {
        return { success: false, error: 'Chain transaction not found' };
      }
      
      return { success: true, data: transaction };
    } catch (error) {
      logger.error('Error getting chain transaction:', error);
      throw error;
    }
  }

  async updateChainTransaction(publicKey, data) {
    try {
      const transactionIndex = this.chainTransactions.findIndex(t => t.publicKey === publicKey);
      if (transactionIndex === -1) {
        return { success: false, error: 'Chain transaction not found' };
      }
      
      this.chainTransactions[transactionIndex] = {
        ...this.chainTransactions[transactionIndex],
        ...data,
        updatedAt: Date.now()
      };
      
      return { success: true, data: this.chainTransactions[transactionIndex], signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error updating chain transaction:', error);
      throw error;
    }
  }

  async deleteChainTransaction(publicKey) {
    try {
      const transactionIndex = this.chainTransactions.findIndex(t => t.publicKey === publicKey);
      if (transactionIndex === -1) {
        return { success: false, error: 'Chain transaction not found' };
      }
      
      this.chainTransactions.splice(transactionIndex, 1);
      return { success: true, signature: `mock_signature_${Date.now()}` };
    } catch (error) {
      logger.error('Error deleting chain transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new MockSolanaService();
