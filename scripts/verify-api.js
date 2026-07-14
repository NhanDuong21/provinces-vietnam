require('dotenv').config();
const axios = require('axios');
const app = require('../src/app');

const TEST_PORT = 3006;
let server;

async function runTests() {
  server = app.listen(TEST_PORT, async () => {
    console.log(`Test server started on port ${TEST_PORT}. Running global verification tests...`);
    const client = axios.create({
      baseURL: `http://localhost:${TEST_PORT}/api/v1`,
      headers: {
        'x-api-key': process.env.API_KEY || 'my_secure_api_key_123'
      },
      validateStatus: () => true // Allow receiving non-2xx status codes without throwing errors
    });

    try {
      // 0. Verify unauthenticated request fails
      console.log('\n--- 0. Testing GET /address/suggest without API Key ---');
      const unauthClient = axios.create({
        baseURL: `http://localhost:${TEST_PORT}/api/v1`,
        validateStatus: () => true
      });
      const unauthRes = await unauthClient.get('/address/suggest', {
        params: { q: 'Shibuya' }
      });
      console.log('Status Code:', unauthRes.status);
      console.log('Body:', JSON.stringify(unauthRes.data, null, 2));
      if (unauthRes.status !== 401 || unauthRes.data.success) {
        throw new Error('Test 0 failed: Request without API Key did not return 401 Unauthorized');
      }

      // 1. Verify GET /address/suggest
      console.log('\n--- 1. Testing GET /address/suggest?q=Shibuya ---');
      const suggestRes = await client.get('/address/suggest', {
        params: { q: 'Shibuya' }
      });
      console.log('Status Code:', suggestRes.status);
      console.log('Success:', suggestRes.data.success);
      console.log('Message:', suggestRes.data.message);
      console.log('Suggestions Count:', suggestRes.data.data ? suggestRes.data.data.length : 0);
      if (suggestRes.data.data && suggestRes.data.data.length > 0) {
        console.log('First Suggestion sample:', suggestRes.data.data[0]);
      }
      if (suggestRes.status !== 200 || !suggestRes.data.success || !Array.isArray(suggestRes.data.data)) {
        throw new Error('Test 1 failed (GET /address/suggest)');
      }

      // 2. Verify POST /geocode (Success case)
      console.log('\n--- 2. Testing POST /geocode (Valid Request) ---');
      const geocodeRes = await client.post('/geocode', {
        address: '2-24-12 Shibuya, Tokyo, Japan'
      });
      console.log('Status Code:', geocodeRes.status);
      console.log('Body:', JSON.stringify(geocodeRes.data, null, 2));
      if (geocodeRes.status !== 200 || !geocodeRes.data.success || !geocodeRes.data.data.latitude) {
        throw new Error('Test 2 failed (POST /geocode Success)');
      }

      // 3. Verify POST /geocode (Validation fail case: empty address)
      console.log('\n--- 3. Testing POST /geocode (Validation failure check) ---');
      const geocodeValRes = await client.post('/geocode', {
        address: ''
      });
      console.log('Status Code:', geocodeValRes.status);
      console.log('Body:', JSON.stringify(geocodeValRes.data, null, 2));
      if (geocodeValRes.status !== 400 || geocodeValRes.data.success || !Array.isArray(geocodeValRes.data.errors)) {
        throw new Error('Test 3 failed (POST /geocode validation check)');
      }

      // 4. Verify GET /address/suggest (Validation fail case: empty query q)
      console.log('\n--- 4. Testing GET /address/suggest (Validation failure check) ---');
      const suggestValRes = await client.get('/address/suggest', {
        params: { q: '  ' }
      });
      console.log('Status Code:', suggestValRes.status);
      console.log('Body:', JSON.stringify(suggestValRes.data, null, 2));
      if (suggestValRes.status !== 400 || suggestValRes.data.success) {
        throw new Error('Test 4 failed (GET /address/suggest validation check)');
      }

      // 5. Verify GET /geocode/reverse
      console.log('\n--- 5. Testing GET /geocode/reverse (Valid coordinates) ---');
      const reverseRes = await client.get('/geocode/reverse', {
        params: { lat: 10.7724246, lon: 106.6996781 }
      });
      console.log('Status Code:', reverseRes.status);
      console.log('Body:', JSON.stringify(reverseRes.data, null, 2));
      if (reverseRes.status !== 200 || !reverseRes.data.success || !reverseRes.data.data.formattedAddress) {
        throw new Error('Test 5 failed (GET /geocode/reverse Success)');
      }

      // 6. Verify GET /geocode/reverse (Validation failure: out of bounds)
      console.log('\n--- 6. Testing GET /geocode/reverse (Validation failure) ---');
      const reverseValRes = await client.get('/geocode/reverse', {
        params: { lat: 95.0, lon: 106.6996781 }
      });
      console.log('Status Code:', reverseValRes.status);
      console.log('Body:', JSON.stringify(reverseValRes.data, null, 2));
      if (reverseValRes.status !== 400 || reverseValRes.data.success) {
        throw new Error('Test 6 failed (GET /geocode/reverse Validation check)');
      }

      console.log('\n======================================================');
      console.log('🎉 Verification Successful! All Global API tests passed.');
      console.log('======================================================');
      cleanup(0);
    } catch (err) {
      console.error('\n❌ Verification Failed:', err.message);
      cleanup(1);
    }
  });
}

function cleanup(exitCode) {
  if (server) {
    server.close(() => {
      console.log('Test server shut down.');
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

runTests();
