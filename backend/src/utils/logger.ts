import winston from 'winston';
import env from '../config/env.js';

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

// Create logger instance
const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // Write error logs to file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      dirname: 'backend/logs',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Write all logs to file
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      dirname: 'backend/logs',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Export logger functions
export default {
  error: (message: string, meta?: Record<string, any>) => logger.error(message, meta),
  warn: (message: string, meta?: Record<string, any>) => logger.warn(message, meta),
  info: (message: string, meta?: Record<string, any>) => logger.info(message, meta),
  debug: (message: string, meta?: Record<string, any>) => logger.debug(message, meta),
  http: (message: string, meta?: Record<string, any>) => logger.http(message, meta),
};
