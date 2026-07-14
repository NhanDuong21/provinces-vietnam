const axios = require('axios');
const GeocodeProvider = require('./provider.interface');
const config = require('../../config');

class PhotonProvider extends GeocodeProvider {
  constructor() {
    super();
    this.baseUrl = 'https://photon.komoot.io/api';
  }

  async geocode(address) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: address,
          limit: 1
        },
        timeout: config.geocode.timeout
      });

      const results = response.data;

      if (!results || !results.features || !Array.isArray(results.features) || results.features.length === 0) {
        const error = new Error(`Address not found: ${address}`);
        error.status = 404;
        throw error;
      }

      const feature = results.features[0];
      const [lon, lat] = feature.geometry.coordinates;

      const props = feature.properties || {};
      const labelParts = [
        props.name,
        props.street ? `${props.housenumber || ''} ${props.street}`.trim() : null,
        props.city,
        props.state,
        props.country
      ].filter(Boolean);
      const formattedAddress = labelParts.join(', ');

      return {
        formattedAddress,
        latitude: lat,
        longitude: lon,
        timezone: 'Asia/Ho_Chi_Minh'
      };

    } catch (error) {
      if (error.status === 404) throw error;
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Photon geocoding provider request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Photon Geocode Error:', error.message);
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
          limit: 5
        },
        timeout: config.geocode.timeout
      });

      const results = response.data;

      if (!results || !results.features || !Array.isArray(results.features)) {
        return [];
      }

      return results.features.map(item => {
        const props = item.properties || {};
        const [lon, lat] = item.geometry.coordinates;

        const labelParts = [
          props.name,
          props.street ? `${props.housenumber || ''} ${props.street}`.trim() : null,
          props.city,
          props.state,
          props.country
        ].filter(Boolean);
        const label = labelParts.join(', ');

        return {
          label,
          latitude: lat,
          longitude: lon,
          country: props.country || '',
          city: props.city || ''
        };
      });

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Photon suggest request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Photon Suggest Error:', error.message);
      const err = new Error('Suggestion provider returned an error');
      err.status = error.response ? error.response.status : 502;
      throw err;
    }
  }

  async reverse(lat, lon) {
    try {
      const response = await axios.get('https://photon.komoot.io/reverse', {
        params: {
          lat,
          lon,
          limit: 1
        },
        timeout: config.geocode.timeout
      });

      const results = response.data;

      if (!results || !results.features || !Array.isArray(results.features) || results.features.length === 0) {
        const error = new Error(`Location not found for coordinates: ${lat}, ${lon}`);
        error.status = 404;
        throw error;
      }

      const feature = results.features[0];
      const [featLon, featLat] = feature.geometry.coordinates;
      const props = feature.properties || {};

      const labelParts = [
        props.name,
        props.street ? `${props.housenumber || ''} ${props.street}`.trim() : null,
        props.city,
        props.state,
        props.country
      ].filter(Boolean);
      const formattedAddress = labelParts.join(', ');

      return {
        formattedAddress,
        latitude: featLat,
        longitude: featLon,
        timezone: 'Asia/Ho_Chi_Minh',
        country: props.country || '',
        city: props.city || ''
      };

    } catch (error) {
      if (error.status === 404) throw error;
      if (error.code === 'ECONNABORTED') {
        const err = new Error('Photon reverse geocoding request timed out');
        err.status = 504;
        throw err;
      }
      console.error('Photon Reverse Geocode Error:', error.message);
      const err = new Error('Reverse geocoding provider returned an error');
      err.status = error.response ? error.response.status : 502;
      throw err;
    }
  }
}

module.exports = PhotonProvider;
