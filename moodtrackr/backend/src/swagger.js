const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoodTrackr API',
      version: '1.0.0',
      description: 'REST API for MoodTrackr – mood logging, AI triggers, and insights.'
    },
    servers: [
      { url: '/'}
    ],
  },
  apis: [
    __filename,
    './src/routes/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
