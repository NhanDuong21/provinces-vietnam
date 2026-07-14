const geocodeService = require('../services/geocode/geocode.service');
const { sendSuccess } = require('../utils/response.utils');

/**
 * Geocode a complete address string
 */
const geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const result = await geocodeService.geocode(address);
    return sendSuccess(res, 'Address geocoded successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve autocomplete suggestions
 */
const suggestAddress = async (req, res, next) => {
  try {
    const { q } = req.query;
    const result = await geocodeService.suggest(q);
    return sendSuccess(res, 'Suggestions retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Reverse geocode coordinates to get address
 */
const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const result = await geocodeService.reverse(lat, lon);
    return sendSuccess(res, 'Coordinates reverse geocoded successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  geocodeAddress,
  suggestAddress,
  reverseGeocode
};
