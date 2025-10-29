const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MoodTrackr API',
      version: '1.0.0',
      description: 'REST API for mood logging, trigger detection, and insights.'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local server'
      }
    ]
  },
  apis: ['src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
