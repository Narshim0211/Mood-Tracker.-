const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MoodTrackr API',
    version: '1.0.0',
    description: 'REST API for MoodTrackr – mood logging, triggers, and insights.',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Local dev' },
  ],
  components: {
    schemas: {
      MoodLog: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date-time' },
          emoji: { type: 'string' },
          scale: { type: 'integer', minimum: 1, maximum: 10 },
          triggers: { type: 'array', items: { type: 'string' } },
          tip: { type: 'string' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
