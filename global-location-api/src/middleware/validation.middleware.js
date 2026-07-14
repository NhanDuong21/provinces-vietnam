const { sendError } = require('../utils/response.utils');

const validateSuggestRequest = (req, res, next) => {
  const { q } = req.query;
  const errors = [];

  if (!q || typeof q !== 'string' || !q.trim()) {
    errors.push({ field: 'q', message: 'Query string "q" is required and must be a non-empty string' });
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', errors, 400);
  }

  next();
};

const validateGeocodeRequest = (req, res, next) => {
  const { address } = req.body;
  const errors = [];

  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.push({ field: 'address', message: 'Address is required and must be a non-empty string' });
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', errors, 400);
  }

  next();
};

const validateReverseRequest = (req, res, next) => {
  const { lat, lon } = req.query;
  const errors = [];

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (lat === undefined || isNaN(latitude) || latitude < -90 || latitude > 90) {
    errors.push({ field: 'lat', message: 'Latitude "lat" is required and must be a number between -90 and 90' });
  }

  if (lon === undefined || isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.push({ field: 'lon', message: 'Longitude "lon" is required and must be a number between -180 and 180' });
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', errors, 400);
  }

  next();
};

module.exports = {
  validateSuggestRequest,
  validateGeocodeRequest,
  validateReverseRequest
};
