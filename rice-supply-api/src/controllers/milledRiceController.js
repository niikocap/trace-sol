const solanaService = require('../services/solanaService');
const { formatResponse, formatError, asyncHandler, validatePagination } = require('../utils/helpers');

// Get all milled rice records with pagination
const getAllMilledRice = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const milledRice = await solanaService.getAllMilledRice();
  
  const response = formatResponse({ milledRice }, 'Milled rice records retrieved successfully');
  res.json(response);
});

// Get specific milled rice record by public key
const getMilledRice = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const milledRice = await solanaService.getMilledRice(publicKey);
  
  if (!milledRice) {
    return res.status(404).json(formatError('Milled rice record not found'));
  }
  
  res.json(formatResponse(milledRice, 'Milled rice record retrieved successfully'));
});

// Create new milled rice record
const createMilledRice = asyncHandler(async (req, res) => {
  const {
    farmerId,
    totalWeightKg,
    millingType,
    quality,
    photoUrls,
    moisture,
    totalWeightProcessedKg
  } = req.body;
  
  const result = await solanaService.createMilledRice({
    farmerId,
    totalWeightKg,
    millingType,
    quality,
    photoUrls,
    moisture,
    totalWeightProcessedKg
  });
  
  res.status(201).json(formatResponse(result, 'Milled rice record created successfully'));
});

// Update milled rice record
const updateMilledRice = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const updateData = req.body;
  
  const result = await solanaService.updateMilledRice(publicKey, updateData);
  
  res.json(formatResponse(result, 'Milled rice record updated successfully'));
});

// Delete milled rice record
const deleteMilledRice = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const result = await solanaService.deleteMilledRice(publicKey);
  
  res.json(formatResponse(result, 'Milled rice deleted successfully'));
});

module.exports = {
  getAllMilledRice,
  getMilledRice,
  createMilledRice,
  updateMilledRice,
  deleteMilledRice
};
