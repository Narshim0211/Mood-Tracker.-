const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MoodTrackr API',
    version: '0.1.0',
    description: 'REST API for MoodTrackr – mood logging, triggers, and insights',
  },
  servers: [{ url: '/api' }],
  components: {
    schemas: {
      MoodLog: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date-time' },
          emoji: { type: 'string' },
          scale: { type: 'number' },
          triggers: { type: 'array', items: { type: 'string' } },
          tip: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/mood': {
      post: {
        summary: 'Create a mood log entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  emoji: { type: 'string' },
                  scale: { type: 'number' },
                  triggers: { type: 'array', items: { type: 'string' } },
                  date: { type: 'string', format: 'date-time' },
                },
                required: ['userId', 'emoji', 'scale'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Mood log created',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
      get: {
        summary: 'List mood logs for a user',
        parameters: [{ in: 'query', name: 'userId', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'List of logs', content: { 'application/json': { schema: { type: 'object' } } } },
        },
      },
    },
    '/triggers': {
      post: {
        summary: 'Detect possible triggers for the user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' } }, required: ['userId'] } } },
        },
        responses: { 200: { description: 'Trigger detection result' } },
      },
    },
    '/insights': {
      post: {
        summary: 'Get weekly or monthly insights',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { userId: { type: 'string' }, range: { type: 'string', enum: ['weekly', 'monthly'] } },
                required: ['userId'],
              },
            },
          },
        },
        responses: { 200: { description: 'Insights payload' } },
      },
    },
  },
};

const swaggerOptions = { definition: swaggerDefinition, apis: [] };

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerSpec };
