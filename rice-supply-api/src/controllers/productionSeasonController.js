const solanaService = require('../services/solanaService');
const { formatResponse, formatError, asyncHandler, validatePagination } = require('../utils/helpers');

// Get all production seasons with pagination
const getAllProductionSeasons = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const seasons = await solanaService.getAllProductionSeasons();
  
  const response = formatResponse({ seasons }, 'Production seasons retrieved successfully');
  res.json(response);
});

// Get specific production season by public key
const getProductionSeason = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const season = await solanaService.getProductionSeason(publicKey);
  
  if (!season) {
    return res.status(404).json(formatError('Production season not found'));
  }
  
  res.json(formatResponse(season, 'Production season retrieved successfully'));
});

// Create new production season
const createProductionSeason = asyncHandler(async (req, res) => {
  const {
    farmerId,
    cropYear,
    processedYieldKg,
    variety,
    plannedPractice,
    plantingDate,
    irrigationPractice,
    fertilizerUsed,
    pesticideUsed,
    harvestDate,
    totalYieldKg,
    moistureContent,
    carbonSmartCertified
  } = req.body;
  
  const result = await solanaService.createProductionSeason({
    farmerId,
    cropYear,
    processedYieldKg,
    variety,
    plannedPractice,
    plantingDate,
    irrigationPractice,
    fertilizerUsed,
    pesticideUsed,
    harvestDate,
    totalYieldKg,
    moistureContent,
    carbonSmartCertified
  });
  
  res.status(201).json(formatResponse(result, 'Production season created successfully'));
});

// Update production season
const updateProductionSeason = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const updateData = req.body;
  
  const result = await solanaService.updateProductionSeason(publicKey, updateData);
  
  res.json(formatResponse(result, 'Production season updated successfully'));
});

// Delete production season
const deleteProductionSeason = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const result = await solanaService.deleteProductionSeason(publicKey);
  
  res.json(formatResponse(result, 'Production season deleted successfully'));
});

module.exports = {
  getAllProductionSeasons,
  getProductionSeason,
  createProductionSeason,
  updateProductionSeason,
  deleteProductionSeason
};
