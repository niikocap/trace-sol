const winston = require('winston');
const { PublicKey } = require('@solana/web3.js');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'rice-supply-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Utility functions
const isValidPublicKey = (key) => {
  try {
    new PublicKey(key);
    return true;
  } catch (error) {
    return false;
  }
};

const formatResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

const formatError = (message, error = null, statusCode = 500) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
    response.stack = error.stack;
  }

  return response;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
    offset: (Math.max(1, pageNum) - 1) * Math.min(100, Math.max(1, limitNum))
  };
};

const convertToSolanaTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

const convertFromSolanaTimestamp = (timestamp) => {
  return new Date(timestamp * 1000);
};

module.exports = {
  logger,
  isValidPublicKey,
  formatResponse,
  formatError,
  asyncHandler,
  validatePagination,
  convertToSolanaTimestamp,
  convertFromSolanaTimestamp
};
