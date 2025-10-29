require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const moodRoutes = require('./routes/mood');
const triggersRoutes = require('./routes/triggers');
const insightsRoutes = require('./routes/insights');
const swaggerUi = require('swagger-ui-express');
const { getSpec } = require('./docs/swagger');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.json({ ok: true, service: 'MoodTrackr API' });
  });

  app.use('/api/mood', moodRoutes);
  app.use('/api/triggers', triggersRoutes);
  app.use('/api/insights', insightsRoutes);

  const swaggerSpec = getSpec();
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
}

module.exports = { createApp };
