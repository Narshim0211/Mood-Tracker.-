const mongoose = require('mongoose');

let isDbConnected = false;

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[db] MONGODB_URI not set. API will try to run without DB.');
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    console.error('[db] MongoDB connection error:', err.message);
    isDbConnected = false;
  }
}

module.exports = { connectToDatabase, isDbConnected };
