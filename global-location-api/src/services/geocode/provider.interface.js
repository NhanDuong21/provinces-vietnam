class GeocodeProvider {
  /**
   * Forward geocode a full address string
   * @param {string} address - The complete address
   * @returns {Promise<{formattedAddress: string, latitude: number, longitude: number, timezone: string}>}
   */
  async geocode(address) {
    throw new Error('Method "geocode" must be implemented by subclass');
  }

  /**
   * Fetch autocomplete suggestions for a query string
   * @param {string} query - The search query
   * @returns {Promise<Array<{label: string, latitude: number, longitude: number, country: string, city: string}>>}
   */
  async suggest(query) {
    throw new Error('Method "suggest" must be implemented by subclass');
  }

  /**
   * Reverse geocode a latitude and longitude coordinate
   * @param {number|string} lat - Latitude
   * @param {number|string} lon - Longitude
   * @returns {Promise<{formattedAddress: string, latitude: number, longitude: number, timezone: string, country: string, city: string}>}
   */
  async reverse(lat, lon) {
    throw new Error('Method "reverse" must be implemented by subclass');
  }
}

module.exports = GeocodeProvider;
