const solanaService = require('../services/solanaService');
const { formatResponse, formatError, asyncHandler, validatePagination } = require('../utils/helpers');

// Get all chain actors with pagination
const getAllChainActors = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const actors = await solanaService.getAllChainActors();
  
  const response = formatResponse({ actors }, 'Chain actors retrieved successfully');
  res.json(response);
});

// Get specific chain actor by public key
const getChainActor = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  const actor = await solanaService.getChainActor(publicKey);
  
  if (!actor) {
    return res.status(404).json(formatError('Chain actor not found'));
  }
  
  res.json(formatResponse(actor, 'Chain actor retrieved successfully'));
});

// Create new chain actor
const createChainActor = asyncHandler(async (req, res) => {
  const {
    name,
    actorType,
    farmId,
    farmerId,
    assignedTps,
    pin,
    organization,
    address
  } = req.body;
  
  const result = await solanaService.createChainActor({
    name,
    actorType,
    farmId,
    farmerId,
    assignedTps,
    pin,
    organization,
    address
  });
  
  res.status(201).json(formatResponse(result, 'Chain actor created successfully'));
});

// Update chain actor
const updateChainActor = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  const updateData = req.body;
  
  const result = await solanaService.updateChainActor(publicKey, updateData);
  
  res.json(formatResponse(result, 'Chain actor updated successfully'));
});

// Delete chain actor (Note: In blockchain, we typically don't delete, but mark as inactive)
const deleteChainActor = asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  // Instead of deleting, we mark as inactive
  const result = await solanaService.updateChainActor(publicKey, { isActive: false });
  
  res.json(formatResponse(result, 'Chain actor deactivated successfully'));
});

module.exports = {
  getAllChainActors,
  getChainActor,
  createChainActor,
  updateChainActor,
  deleteChainActor
};
