const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');

const moodRouter = require('./routes/mood');
const triggersRouter = require('./routes/triggers');
const insightsRouter = require('./routes/insights');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/mood', moodRouter);
app.use('/triggers', triggersRouter);
app.use('/insights', insightsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = { app };
