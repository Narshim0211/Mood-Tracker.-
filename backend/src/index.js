const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');

const moodRoutes = require('./routes/mood');
const triggerRoutes = require('./routes/triggers');
const insightRoutes = require('./routes/insights');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'moodtrackr-backend' });
});

// Routes
app.use('/api/mood', moodRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/insights', insightRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`MoodTrackr backend listening on port ${PORT}`);
  });
}

module.exports = app;
