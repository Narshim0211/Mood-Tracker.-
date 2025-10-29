const app = require('./app');
const { connectMongoIfConfigured } = require('./store');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectMongoIfConfigured();
    app.listen(PORT, () => {
      console.log(`MoodTrackr API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
