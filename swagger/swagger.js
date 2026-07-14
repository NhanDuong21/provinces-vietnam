const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Global Autocomplete and Geocoding API',
    version: '1.0.0',
    description: 'A global microservice for real-time address autocomplete suggestions and direct coordinate geocoding.'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Server'
    }
  ],
  security: [
    {
      ApiKeyAuth: []
    }
  ],
  paths: {
    '/address/suggest': {
      get: {
        summary: 'Get address suggestions (Autocomplete)',
        description: 'Returns real-time autocomplete suggestions matching a partial query. Returns formatted labels, coordinates, city, and country.',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Partial address text query (e.g. "Shib")',
            schema: {
              type: 'string',
              example: 'Shib'
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of matching suggestions.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse'
                },
                example: {
                  success: true,
                  message: 'Suggestions retrieved successfully',
                  data: [
                    {
                      label: 'Shibuya, Tokyo, Japan',
                      latitude: 35.664035,
                      longitude: 139.698212,
                      country: 'Japan',
                      city: 'Tokyo'
                    },
                    {
                      label: 'Shibukawa, Gunma, Japan',
                      latitude: 36.502012,
                      longitude: 139.003429,
                      country: 'Japan',
                      city: 'Shibukawa'
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Validation failed.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal Server Error.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/geocode': {
      post: {
        summary: 'Direct geocode address string',
        description: 'Resolves full address query into latitude, longitude coordinates.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GeocodeRequest'
              },
              example: {
                address: '2-24-12 Shibuya, Tokyo, Japan'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Geocoding successful.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse'
                },
                example: {
                  success: true,
                  message: 'Address geocoded successfully',
                  data: {
                    formattedAddress: '2-24-12 Shibuya, Tokyo, Kanto, Japan',
                    latitude: 35.658514,
                    longitude: 139.70133,
                    timezone: 'Asia/Ho_Chi_Minh'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation failed.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Address not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal Server Error.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/geocode/reverse': {
      get: {
        summary: 'Reverse geocode coordinates to address',
        description: 'Resolves latitude and longitude coordinates into a human-readable formatted address.',
        parameters: [
          {
            name: 'lat',
            in: 'query',
            required: true,
            description: 'Latitude coordinate (e.g. 10.7724246)',
            schema: {
              type: 'number',
              format: 'float',
              example: 10.7724246
            }
          },
          {
            name: 'lon',
            in: 'query',
            required: true,
            description: 'Longitude coordinate (e.g. 106.6996781)',
            schema: {
              type: 'number',
              format: 'float',
              example: 106.6996781
            }
          }
        ],
        responses: {
          '200': {
            description: 'Reverse geocoding successful.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse'
                },
                example: {
                  success: true,
                  message: 'Coordinates reverse geocoded successfully',
                  data: {
                    formattedAddress: '123 Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
                    latitude: 10.7724246,
                    longitude: 106.6996781,
                    timezone: 'Asia/Ho_Chi_Minh',
                    country: 'Việt Nam',
                    city: 'Thành phố Hồ Chí Minh'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation failed (e.g. coordinates out of range).',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Coordinates not found / no place matches.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal Server Error.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Enter your secret API Key to access endpoints'
      }
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Success'
          },
          data: {
            type: 'object'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      },
      GeocodeRequest: {
        type: 'object',
        required: ['address'],
        properties: {
          address: {
            type: 'string',
            description: 'Full text address (e.g. 2-24-12 Shibuya, Tokyo, Japan)',
            example: '2-24-12 Shibuya, Tokyo, Japan'
          }
        }
      }
    }
  }
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = {
  setupSwagger
};
