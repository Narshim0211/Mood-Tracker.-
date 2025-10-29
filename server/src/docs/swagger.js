const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoodTrackr API',
      version: '0.1.0',
      description: 'API docs for MoodTrackr – AI-Powered Mood Assistant',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Local Dev' },
    ],
  },
  apis: [], // keeping JSDoc-free for brevity; schemas inline below
};

const baseSchemas = {
  MoodLog: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date-time' },
      emoji: { type: 'string' },
      scale: { type: 'integer', minimum: 1, maximum: 10 },
      triggers: { type: 'array', items: { type: 'string' } },
      tip: { type: 'string' },
    },
    required: ['emoji', 'scale'],
  },
};

function getSpec() {
  const spec = swaggerJsdoc(options);
  spec.components = spec.components || {};
  spec.components.schemas = { ...(spec.components.schemas || {}), ...baseSchemas };

  spec.paths = {
    '/api/mood': {
      post: {
        summary: 'Log a mood entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  emoji: { type: 'string' },
                  scale: { type: 'integer', minimum: 1, maximum: 10 },
                  triggers: { type: 'array', items: { type: 'string' } },
                  tip: { type: 'string' },
                },
                required: ['userId', 'emoji', 'scale'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged mood with AI-enriched triggers and suggestion',
          },
        },
      },
    },
    '/api/triggers': {
      post: {
        summary: 'Detect likely triggers from recent logs',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { userId: { type: 'string' } }, required: ['userId'] },
            },
          },
        },
        responses: { 200: { description: 'List of triggers' } },
      },
    },
    '/api/insights': {
      get: {
        summary: 'Get weekly/monthly insights',
        parameters: [
          { name: 'userId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'range', in: 'query', required: false, schema: { type: 'string', enum: ['weekly', 'monthly'] } },
        ],
        responses: { 200: { description: 'Insights summary with series' } },
      },
    },
  };

  return spec;
}

module.exports = { getSpec };
