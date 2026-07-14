const config = require('../config');
const { sendError } = require('../utils/response.utils');

/**
 * Middleware to validate API Key authentication
 */
const validateApiKey = (req, res, next) => {
  // Bypasses check if Swagger UI assets are loaded
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  // Bypass authentication if no key is configured in env
  if (!config.apiKey) {
    return next();
  }

  const apiKeyHeader = req.headers['x-api-key'];

  if (!apiKeyHeader || apiKeyHeader !== config.apiKey) {
    return sendError(res, 'Unauthorized: Invalid or missing API Key', [], 401);
  }

  next();
};

module.exports = validateApiKey;
