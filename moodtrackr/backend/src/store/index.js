const MemoryStore = require('./memoryStore');
const MongoStore = require('./mongoStore');

let store = new MemoryStore();

async function connectMongoIfConfigured() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return;
  }
  try {
    const mongoStore = new MongoStore(uri);
    await mongoStore.connect();
    store = mongoStore;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to memory store:', err.message);
  }
}

module.exports = {
  store,
  getStore: () => store,
  connectMongoIfConfigured,
};
