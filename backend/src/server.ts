import 'dotenv/config';
import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';

const PORT = env.port;

app.listen(PORT, () => {
  logger.info(`Backend API server running on port ${PORT}`, { environment: env.nodeEnv });
  logger.info(`Backend API URL: http://localhost:${PORT}/health`);
  logger.info(`Backend API URL: http://localhost:${PORT}/api`);
  logger.info(`WebSocket URL: ws://localhost:${PORT}`);
});
