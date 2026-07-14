const NominatimProvider = require('./nominatim.provider');
const PhotonProvider = require('./photon.provider');

class GeocodeService {
  constructor() {
    this.providers = {
      nominatim: new NominatimProvider(),
      photon: new PhotonProvider()
    };
  }

  /**
   * Forward geocode a full address
   * @param {string} address - Full address string
   * @returns {Promise<Object>} Geocoding coordinates response
   */
  async geocode(address) {
    const providerName = (process.env.GEOCODE_PROVIDER || 'nominatim').toLowerCase();
    try {
      return await this._executeGeocode(providerName, address);
    } catch (error) {
      const status = error.status || 500;
      if (providerName === 'nominatim' && status !== 404) {
        console.warn(`Primary provider 'nominatim' failed to geocode (status ${status}): ${error.message}. Trying fallback 'photon'...`);
        try {
          return await this._executeGeocode('photon', address);
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
      throw error;
    }
  }

  /**
   * Get real-time address autocomplete suggestions
   * @param {string} query - Search string
   * @returns {Promise<Array>} List of address suggestions
   */
  async suggest(query) {
    const providerName = (process.env.GEOCODE_PROVIDER || 'nominatim').toLowerCase();
    try {
      return await this._executeSuggest(providerName, query);
    } catch (error) {
      const status = error.status || 500;
      if (providerName === 'nominatim' && status !== 404) {
        console.warn(`Primary provider 'nominatim' failed to suggest (status ${status}): ${error.message}. Trying fallback 'photon'...`);
        try {
          return await this._executeSuggest('photon', query);
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {number|string} lat - Latitude
   * @param {number|string} lon - Longitude
   * @returns {Promise<Object>} Address response
   */
  async reverse(lat, lon) {
    const providerName = (process.env.GEOCODE_PROVIDER || 'nominatim').toLowerCase();
    try {
      return await this._executeReverse(providerName, lat, lon);
    } catch (error) {
      const status = error.status || 500;
      if (providerName === 'nominatim' && status !== 404) {
        console.warn(`Primary provider 'nominatim' failed to reverse geocode (status ${status}): ${error.message}. Trying fallback 'photon'...`);
        try {
          return await this._executeReverse('photon', lat, lon);
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
      throw error;
    }
  }

  async _executeGeocode(providerName, address) {
    const provider = this.providers[providerName];
    if (!provider) {
      const error = new Error(`Unsupported provider: ${providerName}`);
      error.status = 500;
      throw error;
    }
    return await provider.geocode(address);
  }

  async _executeSuggest(providerName, query) {
    const provider = this.providers[providerName];
    if (!provider) {
      const error = new Error(`Unsupported provider: ${providerName}`);
      error.status = 500;
      throw error;
    }
    return await provider.suggest(query);
  }

  async _executeReverse(providerName, lat, lon) {
    const provider = this.providers[providerName];
    if (!provider) {
      const error = new Error(`Unsupported provider: ${providerName}`);
      error.status = 500;
      throw error;
    }
    return await provider.reverse(lat, lon);
  }
}

module.exports = new GeocodeService();
