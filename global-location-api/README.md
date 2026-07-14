# Global Autocomplete & Geocoding API

A database-free, production-ready Node.js Express REST API providing global address autocompletion/suggestions and forward geocoding using OpenStreetMap (Nominatim and Photon) APIs.

## Features
- **Global Coverage**: Supports finding coordinates and suggestions for addresses worldwide (e.g. Japan, US, Europe, Vietnam).
- **No Local Database**: All queries are done dynamically against external OSM search indexers; no local JSON files are required.
- **Real-Time Autocomplete**: Exposes a suggest endpoint to retrieve place choices as the user types.
- **Provider Fallback Layer**: Implements a provider-oriented model with automatic routing fallback. If the primary provider (Nominatim) rate-limits or blocks requests, the service switches to Photon.
- **Self-Documenting**: Hosts Swagger UI at `/api-docs` for quick testing.

## Prerequisites
- Node.js (LTS)
- npm

## Install

Clone the repository, navigate into the project directory, and install dependencies:
```bash
cd global-location-api
npm install
```

## Configuration

Duplicate `.env.example` and name it `.env` to configure settings:
```bash
copy .env.example .env
```

Available configuration keys:
- `PORT`: Port the server runs on (default: `3001` to avoid conflicting with standard `3000`).
- `NODE_ENV`: Application environment (`development` or `production`).
- `GEOCODE_PROVIDER`: Primary geocoding provider (`nominatim` or `photon`).
- `GEOCODE_TIMEOUT`: Axios connection timeout in milliseconds (default: `5000`).
- `USER_AGENT`: Custom User-Agent header required by OpenStreetMap Nominatim.

## Run

Run the application in development mode with auto-reload (using nodemon):
```bash
npm run dev
```

For production mode:
```bash
npm start
```

## Verification

To run the end-to-end integration test suite and verify endpoints:
```bash
node scripts/verify-api.js
```

## Swagger API Documentation

Interactive API docs are served at:
```
http://localhost:3001/api-docs
```

All endpoints can be tested live inside the Swagger UI interface.

## API List

### 1. Get Address Suggestions (Autocomplete)
- **Endpoint**: `GET /api/v1/address/suggest`
- **Query Parameters**:
  - `q`: Partial address string to autocomplete (e.g., `q=Shibuya`).
- **Response Format (200 Success)**:
  ```json
  {
    "success": true,
    "message": "Suggestions retrieved successfully",
    "data": [
      {
        "label": "Shibuya, Tokyo, Japan",
        "latitude": 35.664035,
        "longitude": 139.698212,
        "country": "Japan",
        "city": "Tokyo"
      }
    ]
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If query parameter `q` is missing or empty.
  - **502 Bad Gateway**: If geocoding provider is offline.

### 2. Geocode Full Address
- **Endpoint**: `POST /api/v1/geocode`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "address": "2-24-12 Shibuya, Tokyo, Japan"
  }
  ```
- **Response Format (200 Success)**:
  ```json
  {
    "success": true,
    "message": "Address geocoded successfully",
    "data": {
      "formattedAddress": "2-24-12 Shibuya, Tokyo, Kanto, Japan",
      "latitude": 35.658514,
      "longitude": 139.70133,
      "timezone": "Asia/Ho_Chi_Minh"
    }
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If `address` body parameter is missing or empty.
  - **404 Not Found**: If the address cannot be resolved.
  - **502 Bad Gateway / 504 Gateway Timeout**: If geocoding provider fails or times out.
