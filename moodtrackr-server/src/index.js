const { config } = require('./config');
const { connectToDatabase } = require('./db');
const { app } = require('./app');

async function start() {
  await connectToDatabase();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`MoodTrackr API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
