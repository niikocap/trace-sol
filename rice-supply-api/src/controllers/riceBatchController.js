const solanaService = require('../services/solanaService');
const { formatResponse, formatError, asyncHandler, validatePagination } = require('../utils/helpers');

// Get all rice batches with pagination
const getAllRiceBatches = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const batches = await solanaService.getAllRiceBatches();
  
  const response = formatResponse({ batches }, 'Rice batches retrieved successfully');
  res.json(response);
});

// Get specific rice batch by public key
const getRiceBatch = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const batch = await solanaService.getRiceBatch(publicKey);
  
  if (!batch) {
    return res.status(404).json(formatError('Rice batch not found'));
  }
  
  res.json(formatResponse(batch, 'Rice batch retrieved successfully'));
});

// Get rice batch by QR code
const getRiceBatchByQR = asyncHandler(async (req, res) => {
  const { qrCode } = req.params;
  
  const batch = await solanaService.getRiceBatchByQR(qrCode);
  
  if (!batch) {
    return res.status(404).json(formatError('Rice batch not found with the provided QR code'));
  }
  
  res.json(formatResponse(batch, 'Rice batch retrieved successfully'));
});

// Create new rice batch
const createRiceBatch = asyncHandler(async (req, res) => {
  const {
    qrCode,
    millingId,
    batchWeightKg,
    moistureContent,
    seasonId,
    currentHolderId,
    pricePerKg,
    dryingId,
    validator,
    status
  } = req.body;
  
  const result = await solanaService.createRiceBatch({
    qrCode,
    millingId,
    batchWeightKg,
    moistureContent,
    seasonId,
    currentHolderId,
    pricePerKg,
    dryingId,
    validator,
    status
  });
  
  res.status(201).json(formatResponse(result, 'Rice batch created successfully'));
});

// Update rice batch
const updateRiceBatch = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const updateData = req.body;
  
  const result = await solanaService.updateRiceBatch(publicKey, updateData);
  
  res.json(formatResponse(result, 'Rice batch updated successfully'));
});

// Delete rice batch
const deleteRiceBatch = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const result = await solanaService.deleteRiceBatch(publicKey);
  
  res.json(formatResponse(result, 'Rice batch deleted successfully'));
});

module.exports = {
  getAllRiceBatches,
  getRiceBatch,
  getRiceBatchByQR,
  createRiceBatch,
  updateRiceBatch,
  deleteRiceBatch
};
