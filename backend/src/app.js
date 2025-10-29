const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const moodRouter = require('./routes/mood');
const triggersRouter = require('./routes/triggers');
const insightsRouter = require('./routes/insights');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

app.use('/api/mood', moodRouter);
app.use('/api/triggers', triggersRouter);
app.use('/api/insights', insightsRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

module.exports = app;
