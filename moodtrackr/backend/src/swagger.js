const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoodTrackr API',
      version: '1.0.0',
      description: 'REST API for MoodTrackr - mood logs, triggers, insights',
    },
    servers: [{ url: '/api' }],
  },
  apis: ['./src/routes/*.js'],
};

function setupSwagger(app, basePath = '/docs') {
  const specs = swaggerJsdoc(options);
  app.use(basePath, swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = { setupSwagger };
