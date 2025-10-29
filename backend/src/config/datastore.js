const MongoUserRepository = require('../repositories/mongoUserRepository');
const InMemoryUserRepository = require('../repositories/inMemoryUserRepository');

const useInMemory = String(process.env.USE_IN_MEMORY_DB || 'true').toLowerCase() !== 'false';

let repositoryInstance;

function getUserRepository() {
  if (repositoryInstance) return repositoryInstance;
  if (useInMemory) {
    repositoryInstance = new InMemoryUserRepository();
    return repositoryInstance;
  }
  const mongoRepo = new MongoUserRepository();
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/moodtrackr';
  mongoRepo.connect(uri).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Mongo connection failed, falling back to in-memory:', err.message);
    repositoryInstance = new InMemoryUserRepository();
  });
  repositoryInstance = mongoRepo;
  return repositoryInstance;
}

module.exports = {
  getUserRepository
};
