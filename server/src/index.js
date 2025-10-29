require('dotenv').config();
const { connectToDatabase } = require('./config/db');
const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 4000;

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
    console.log(`[docs] Swagger at http://localhost:${PORT}/api/docs`);
  });
})();
