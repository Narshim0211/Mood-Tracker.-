const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { config } = require('./config');

let memoryServer = null;
let isConnecting = false;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) {
    // Wait for existing connection attempt
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mongoose.connection;
  }
  isConnecting = true;
  try {
    if (config.mongoUrl && !config.useMemoryMongo) {
      await mongoose.connect(config.mongoUrl, {
        dbName: process.env.MONGO_DB || 'moodtrackr',
      });
    } else {
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri, { dbName: 'moodtrackr' });
    }
    return mongoose.connection;
  } finally {
    isConnecting = false;
  }
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase };
