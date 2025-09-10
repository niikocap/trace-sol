const express = require('express');
const router = express.Router();

// Import controllers
const chainActorController = require('../controllers/chainActorController');
const productionSeasonController = require('../controllers/productionSeasonController');
const milledRiceController = require('../controllers/milledRiceController');
const riceBatchController = require('../controllers/riceBatchController');
const chainTransactionController = require('../controllers/chainTransactionController');

// Import middleware
const {
  validatePublicKey,
  validateRequestBody,
  validateOptionalPublicKeys,
  validateEnumField,
  validateArrayField,
  validateNumericField,
  validateDateField
} = require('../middleware/auth');

// Chain Actors Routes
router.get('/chain-actors', chainActorController.getAllChainActors);
router.get('/chain-actors/:publicKey', 
  validatePublicKey('publicKey'),
  chainActorController.getChainActor
);
router.post('/chain-actors',
  validateRequestBody(['name', 'actorType', 'assignedTps', 'pin', 'organization']),
  validateOptionalPublicKeys(['farmId', 'farmerId']),
  validateArrayField('actorType', 10),
  validateNumericField('assignedTps', 0),
  validateEnumField('organization', ['blo', 'buyback', 'coop', 'none']),
  chainActorController.createChainActor
);
router.put('/chain-actors/:publicKey',
  validatePublicKey('publicKey'),
  validateOptionalPublicKeys(['farmId', 'farmerId']),
  validateArrayField('actorType', 10),
  validateNumericField('assignedTps', 0),
  validateNumericField('balance', 0),
  validateEnumField('organization', ['blo', 'buyback', 'coop', 'none']),
  chainActorController.updateChainActor
);
router.delete('/chain-actors/:publicKey',
  validatePublicKey('publicKey'),
  chainActorController.deleteChainActor
);

// Production Seasons Routes
router.get('/production-seasons', productionSeasonController.getAllProductionSeasons);
router.get('/production-seasons/:publicKey',
  validatePublicKey('publicKey'),
  productionSeasonController.getProductionSeason
);
router.post('/production-seasons',
  validateRequestBody(['farmerId', 'cropYear', 'processedYieldKg', 'carbonSmartCertified']),
  validateOptionalPublicKeys(['farmerId', 'validatorId']),
  validateNumericField('processedYieldKg', 0),
  validateNumericField('totalYieldKg', 0),
  validateNumericField('moistureContent', 0, 10000),
  validateDateField('plantingDate'),
  validateDateField('harvestDate'),
  validateEnumField('validationStatus', ['pending', 'validated', 'rejected']),
  productionSeasonController.createProductionSeason
);
router.put('/production-seasons/:publicKey',
  validatePublicKey('publicKey'),
  validateOptionalPublicKeys(['validatorId']),
  validateNumericField('processedYieldKg', 0),
  validateNumericField('totalYieldKg', 0),
  validateNumericField('moistureContent', 0, 10000),
  validateDateField('plantingDate'),
  validateDateField('harvestDate'),
  validateEnumField('validationStatus', ['pending', 'validated', 'rejected']),
  productionSeasonController.updateProductionSeason
);
router.delete('/production-seasons/:publicKey',
  validatePublicKey('publicKey'),
  productionSeasonController.deleteProductionSeason
);

// Milled Rice Routes
router.get('/milled-rice', milledRiceController.getAllMilledRice);
router.get('/milled-rice/:publicKey',
  validatePublicKey('publicKey'),
  milledRiceController.getMilledRice
);
router.post('/milled-rice',
  validateRequestBody(['farmerId', 'totalWeightKg', 'millingType', 'quality', 'moisture', 'totalWeightProcessedKg']),
  validateOptionalPublicKeys(['farmerId']),
  validateArrayField('photoUrls', 20),
  validateNumericField('moisture', 0, 10000),
  validateNumericField('totalWeightProcessedKg', 0),
  milledRiceController.createMilledRice
);
router.put('/milled-rice/:publicKey',
  validatePublicKey('publicKey'),
  validateArrayField('photoUrls', 20),
  validateNumericField('moisture', 0, 10000),
  validateNumericField('totalWeightProcessedKg', 0),
  milledRiceController.updateMilledRice
);
router.delete('/milled-rice/:publicKey',
  validatePublicKey('publicKey'),
  milledRiceController.deleteMilledRice
);

// Rice Batches Routes
router.get('/rice-batches', riceBatchController.getAllRiceBatches);
router.get('/rice-batches/:publicKey',
  validatePublicKey('publicKey'),
  riceBatchController.getRiceBatch
);
router.get('/rice-batches/qr/:qrCode', riceBatchController.getRiceBatchByQR);
router.post('/rice-batches',
  validateRequestBody(['qrCode', 'batchWeightKg', 'seasonId', 'status']),
  validateOptionalPublicKeys(['millingId', 'seasonId', 'currentHolderId', 'dryingId', 'validator']),
  validateNumericField('batchWeightKg', 0),
  validateNumericField('moistureContent', 0, 10000),
  validateNumericField('pricePerKg', 0),
  validateEnumField('status', ['forSale', 'stock', 'consumed']),
  riceBatchController.createRiceBatch
);
router.put('/rice-batches/:publicKey',
  validatePublicKey('publicKey'),
  validateOptionalPublicKeys(['millingId', 'currentHolderId', 'dryingId', 'validator']),
  validateNumericField('batchWeightKg', 0),
  validateNumericField('moistureContent', 0, 10000),
  validateNumericField('pricePerKg', 0),
  validateEnumField('status', ['forSale', 'stock', 'consumed']),
  riceBatchController.updateRiceBatch
);
router.delete('/rice-batches/:publicKey',
  validatePublicKey('publicKey'),
  riceBatchController.deleteRiceBatch
);

// Chain Transactions Routes
router.get('/chain-transactions', chainTransactionController.getAllChainTransactions);
router.get('/chain-transactions/:publicKey',
  validatePublicKey('publicKey'),
  chainTransactionController.getChainTransaction
);
router.post('/chain-transactions',
  validateRequestBody(['batchIds', 'toActorId']),
  validateOptionalPublicKeys(['fromActorId', 'toActorId']),
  validateArrayField('batchIds', 50),
  validateArrayField('paymentReference', 10),
  validateArrayField('geotagging', 10),
  validateNumericField('pricePerKg', 0),
  validateNumericField('moisture', 0, 10000),
  validateEnumField('paymentMethod', ['cash', 'cheque', 'online']),
  validateEnumField('status', ['pending', 'loading', 'completed', 'cancelled', 'failed']),
  chainTransactionController.createChainTransaction
);
router.put('/chain-transactions/:publicKey',
  validatePublicKey('publicKey'),
  validateArrayField('paymentReference', 10),
  validateArrayField('geotagging', 10),
  validateNumericField('pricePerKg', 0),
  validateNumericField('moisture', 0, 10000),
  validateEnumField('paymentMethod', ['cash', 'cheque', 'online']),
  validateEnumField('status', ['pending', 'loading', 'completed', 'cancelled', 'failed']),
  chainTransactionController.updateChainTransaction
);
router.delete('/chain-transactions/:publicKey',
  validatePublicKey('publicKey'),
  chainTransactionController.deleteChainTransaction
);

module.exports = router;
