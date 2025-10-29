const app = require('./app');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MoodTrackr API listening on port ${PORT}`);
});
