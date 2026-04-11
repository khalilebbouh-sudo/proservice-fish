const mongoose = require('mongoose');

let memoryServer = null;

async function resolveMongoUri() {
  const useMemory =
    process.env.NODE_ENV !== 'production' && process.env.USE_MEMORY_MONGO === '1';

  if (useMemory) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }
    return memoryServer.getUri();
  }

  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  throw new Error(
    'MONGODB_URI is not set. Options: MongoDB local / Docker / Atlas, or for dev set USE_MEMORY_MONGO=1 (see README).'
  );
}

async function connectDb() {
  const uri = await resolveMongoUri();
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
}

module.exports = { connectDb };
