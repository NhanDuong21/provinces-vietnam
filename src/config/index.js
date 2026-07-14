const dotenv = require('dotenv');
const path = require('path');

// Load environment configurations
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || '',
  geocode: {
    provider: process.env.GEOCODE_PROVIDER || 'nominatim',
    timeout: parseInt(process.env.GEOCODE_TIMEOUT, 10) || 5000,
    userAgent: process.env.USER_AGENT || 'global-location-api-service/1.0 (contact@example.com)'
  }
};
