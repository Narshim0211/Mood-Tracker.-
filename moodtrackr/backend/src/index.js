require('dotenv/config');
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db.js');
const moodRouter = require('./routes/mood.js');
const triggersRouter = require('./routes/triggers.js');
const insightsRouter = require('./routes/insights.js');
const { setupSwagger } = require('./swagger.js');

const app = express();

app.use(cors());
app.use(express.json());

const API_BASE = process.env.API_BASE || '/api';

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(`${API_BASE}/mood`, moodRouter);
app.use(`${API_BASE}/triggers`, triggersRouter);
app.use(`${API_BASE}/insights`, insightsRouter);

setupSwagger(app, `${API_BASE}/docs`);

const port = process.env.PORT || 4000;

async function start() {
  await connectDb();
  app.listen(port, () => console.log(`[Server] Listening on http://localhost:${port}`));
}

// Only start the HTTP server when this file is executed directly.
// Importers (e.g., Vercel serverless functions) will receive the Express app
// without binding to a port.
if (require.main === module) {
  start();
}

module.exports = app;
