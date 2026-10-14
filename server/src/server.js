import { app } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    await connectDB();
    logger.info('Database connected successfully.');

    const server = app.listen(ENV.PORT, () => {
      logger.info(`UNSEEN Backend API listening on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
      logger.info(`Health check available at http://localhost:${ENV.PORT}/api/health`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Gracefully shutting down UNSEEN server...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('UNSEEN server shut down gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to initialize UNSEEN server:', error);
    process.exit(1);
  }
}

startServer();
