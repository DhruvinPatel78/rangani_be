const app = require('./app');
const config = require('./config');
const connectDB = require('./database/connection');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Rangani Parivaar API running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(`Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
