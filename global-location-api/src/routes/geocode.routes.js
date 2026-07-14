const express = require('express');
const router = express.Router();
const geocodeController = require('../controllers/geocode.controller');
const { validateSuggestRequest, validateGeocodeRequest, validateReverseRequest } = require('../middleware/validation.middleware');

router.post('/geocode', validateGeocodeRequest, geocodeController.geocodeAddress);
router.get('/address/suggest', validateSuggestRequest, geocodeController.suggestAddress);
router.get('/geocode/reverse', validateReverseRequest, geocodeController.reverseGeocode);

module.exports = router;
