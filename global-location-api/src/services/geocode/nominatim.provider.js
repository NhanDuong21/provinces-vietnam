const axios = require('axios');
const GeocodeProvider = require('./provider.interface');
const config = require('../../config');

class NominatimProvider extends GeocodeProvider {
  constructor() {
    super();
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
  }

  async geocode(address) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': config.geocode.userAgent
        },
        timeout: config.geocode.timeout
      });

      const results = response.data;

      if (!results || !Array.isArray(results) || results.length === 0) {
        const error = new Error(`Address not found: ${address}`);
        error.status = 404;
        throw error;
      }

      const location = results[0];

      return {
        formattedAddress: location.display_name,
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        timezone: 'Asia/Ho_Chi_Minh'
      };

    } catch (error) {
      if (error.status === 404) throw error;
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Nominatim geocoding provider request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Nominatim Geocode Error:', error.message);
      const err = new Error('Geocoding provider returned an error');
      err.status = error.response ? error.response.status : 502;
      throw err;
    }
  }

  async suggest(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          format: 'json',
          limit: 5,
          addressdetails: 1
        },
        headers: {
          'User-Agent': config.geocode.userAgent
        },
        timeout: config.geocode.timeout
      });

      const results = response.data;

      if (!results || !Array.isArray(results)) {
        return [];
      }

      return results.map(item => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
        return {
          label: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          country: addr.country || '',
          city: city
        };
      });

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Nominatim suggest request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Nominatim Suggest Error:', error.message);
      const err = new Error('Suggestion provider returned an error');
      err.status = error.response ? error.response.status : 502;
      throw err;
    }
  }

  async reverse(lat, lon) {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': config.geocode.userAgent
        },
        timeout: config.geocode.timeout
      });

      const result = response.data;

      if (!result || !result.display_name) {
        const error = new Error(`Location not found for coordinates: ${lat}, ${lon}`);
        error.status = 404;
        throw error;
      }

      const addr = result.address || {};
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';

      return {
        formattedAddress: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        timezone: 'Asia/Ho_Chi_Minh',
        country: addr.country || '',
        city: city
      };

    } catch (error) {
      if (error.status === 404) throw error;
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Nominatim reverse geocoding request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Nominatim Reverse Geocode Error:', error.message);
      const err = new Error('Reverse geocoding provider returned an error');
      err.status = error.response ? error.response.status : 502;
      throw err;
    }
  }
}

module.exports = NominatimProvider;
