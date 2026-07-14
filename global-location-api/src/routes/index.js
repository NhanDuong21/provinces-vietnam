const express = require('express');
const router = express.Router();
const geocodeRoutes = require('./geocode.routes');

router.use('/', geocodeRoutes);

module.exports = router;
