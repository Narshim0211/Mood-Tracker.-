const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');
const moodRouter = require('./routes/mood');
const triggersRouter = require('./routes/triggers');
const insightsRouter = require('./routes/insights');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/mood', moodRouter);
app.use('/api/triggers', triggersRouter);
app.use('/api/insights', insightsRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
