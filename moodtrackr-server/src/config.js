const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUrl: process.env.MONGO_URL || '',
  useMemoryMongo: process.env.USE_MEMORY_MONGO === 'true' || !process.env.MONGO_URL,
};

module.exports = { config };
