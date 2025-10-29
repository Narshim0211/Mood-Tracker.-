const mongoose = require('mongoose');

let isMongoConnected = false;

async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('[DB] No MONGO_URI set. Using in-memory store.');
    isMongoConnected = false;
    return null;
  }
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    isMongoConnected = true;
    console.log('[DB] Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('[DB] Mongo connection failed:', err.message);
    isMongoConnected = false;
    return null;
  }
}

function mongoConnected() {
  return isMongoConnected;
}

module.exports = { connectDb, mongoConnected };
