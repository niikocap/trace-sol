const { isValidPublicKey, formatError } = require('../utils/helpers');

// Middleware to validate public key parameters
const validatePublicKey = (paramName = 'publicKey') => {
  return (req, res, next) => {
    const publicKey = req.params[paramName];
    
    if (!publicKey) {
      return res.status(400).json(formatError(`${paramName} parameter is required`));
    }
    
    if (!isValidPublicKey(publicKey)) {
      return res.status(400).json(formatError(`Invalid ${paramName} format`));
    }
    
    next();
  };
};

// Middleware to validate request body
const validateRequestBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      // For boolean fields, false is a valid value
      if (typeof value === 'boolean') {
        return false;
      }
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json(formatError(
        `Missing required fields: ${missingFields.join(', ')}`
      ));
    }
    
    next();
  };
};

// Middleware to validate optional public key fields in request body
const validateOptionalPublicKeys = (fields = []) => {
  return (req, res, next) => {
    const invalidFields = [];
    
    fields.forEach(field => {
      const value = req.body[field];
      if (value && !isValidPublicKey(value)) {
        invalidFields.push(field);
      }
    });
    
    if (invalidFields.length > 0) {
      return res.status(400).json(formatError(
        `Invalid public key format in fields: ${invalidFields.join(', ')}`
      ));
    }
    
    next();
  };
};

// Middleware to validate enum values
const validateEnumField = (field, validValues) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value && !validValues.includes(value)) {
      return res.status(400).json(formatError(
        `Invalid ${field}. Must be one of: ${validValues.join(', ')}`
      ));
    }
    
    next();
  };
};

// Middleware to validate array fields
const validateArrayField = (field, maxLength = 100) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value && (!Array.isArray(value) || value.length > maxLength)) {
      return res.status(400).json(formatError(
        `${field} must be an array with maximum ${maxLength} items`
      ));
    }
    
    next();
  };
};

// Middleware to validate numeric fields
const validateNumericField = (field, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined && value !== null) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < min || numValue > max) {
        return res.status(400).json(formatError(
          `${field} must be a number between ${min} and ${max}`
        ));
      }
    }
    
    next();
  };
};

// Middleware to validate date fields
const validateDateField = (field) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value && isNaN(Date.parse(value))) {
      return res.status(400).json(formatError(
        `${field} must be a valid date`
      ));
    }
    
    next();
  };
};

module.exports = {
  validatePublicKey,
  validateRequestBody,
  validateOptionalPublicKeys,
  validateEnumField,
  validateArrayField,
  validateNumericField,
  validateDateField
};
