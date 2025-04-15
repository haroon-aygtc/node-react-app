/**
 * Centralized environment configuration
 * All environment variables should be accessed through this file
 */
// Import necessary modules
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from the appropriate .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First load default .env file if it exists
dotenv.config({ path: path.resolve(__dirname, '../../', '.env') });

// Then load environment-specific file to override defaults if needed
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '../../', envFile), override: true });

const env = {
  // Server configuration
  port: process.env.PORT || 5000, // Default port for debugging
  nodeEnv: process.env.NODE_ENV || 'development', // Default to development for debugging

  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'changeme',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Database
  database: {
    url: process.env.DB_URL || process.env.DATABASE_URL
  },

  // CORS
  cors: {
    // We don't need a default origin since we're using regex patterns in cors.ts
    origin: process.env.CORS_ORIGIN || '',
    productionOrigin: process.env.CORS_PRODUCTION_ORIGIN || 'https://yourdomain.com'
  }
};

export default env;
