const { sendError } = require('../utils/response.utils');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  return sendError(res, message, errors, statusCode);
};

module.exports = errorHandler;
