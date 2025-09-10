const solanaService = require('../services/solanaService');
const { formatResponse, formatError, asyncHandler, validatePagination } = require('../utils/helpers');

// Get all chain transactions with pagination
const getAllChainTransactions = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const transactions = await solanaService.getAllChainTransactions();
  
  const response = formatResponse({ transactions }, 'Chain transactions retrieved successfully');
  res.json(response);
});

// Get specific chain transaction by public key
const getChainTransaction = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const transaction = await solanaService.getChainTransaction(publicKey);
  
  if (!transaction) {
    return res.status(404).json(formatError('Chain transaction not found'));
  }
  
  res.json(formatResponse(transaction, 'Chain transaction retrieved successfully'));
});

// Create new chain transaction
const createChainTransaction = asyncHandler(async (req, res) => {
  const {
    batchIds,
    fromActorId,
    toActorId,
    pricePerKg,
    moisture,
    quality,
    paymentReference,
    paymentMethod,
    geotagging
  } = req.body;
  
  const result = await solanaService.createChainTransaction({
    batchIds,
    fromActorId,
    toActorId,
    pricePerKg,
    moisture,
    quality,
    paymentReference,
    paymentMethod,
    geotagging
  });
  
  res.status(201).json(formatResponse(result, 'Chain transaction created successfully'));
});

// Update chain transaction
const updateChainTransaction = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const updateData = req.body;
  
  const result = await solanaService.updateChainTransaction(publicKey, updateData);
  
  res.json(formatResponse(result, 'Chain transaction updated successfully'));
});

// Delete chain transaction
const deleteChainTransaction = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const result = await solanaService.deleteChainTransaction(publicKey);
  
  res.json(formatResponse(result, 'Chain transaction deleted successfully'));
});

module.exports = {
  getAllChainTransactions,
  getChainTransaction,
  createChainTransaction,
  updateChainTransaction,
  deleteChainTransaction
};
