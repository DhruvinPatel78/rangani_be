const mongoose = require('mongoose');
const config = require('../config');
const seedDatabase = require('./seedData');

let memoryServer = null;
let usingMemoryServer = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(config.mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    usingMemoryServer = false;
    return { usingMemoryServer };
  } catch (error) {
    if (config.env === 'production') {
      throw error;
    }

    console.warn(`MongoDB unavailable at ${config.mongoUri}. Starting in-memory MongoDB for development...`);
    console.warn(error.message);

    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri('rangani_parivaar');
    await mongoose.connect(uri);
    usingMemoryServer = true;
    console.log('In-memory MongoDB connected for development');

    const result = await seedDatabase({ clear: true });
    console.log(`Auto-seed: ${result.message}`);

    return { usingMemoryServer };
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
module.exports.isUsingMemoryServer = () => usingMemoryServer;
