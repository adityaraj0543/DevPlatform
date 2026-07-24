const swaggerJSDoc = require('swagger-jsdoc');
module.exports = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Developer Platform API', version: '1.0.0', description: 'REST API for the collaboration platform' },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
});
