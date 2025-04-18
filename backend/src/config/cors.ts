import { CorsOptions } from 'cors';
import env from './env.js';

// Define patterns for allowed local development origins
const allowedLocalPatterns = [
  /^http:\/\/localhost:\d+$/,     // allow localhost on any port
  /^http:\/\/127\.0\.0\.1:\d+$/,  // allow IP-based local dev
];

// Explicitly allow these origins for development
const explicitlyAllowedOrigins = [
  'http://localhost:5179',
  'http://localhost:5178',
  'http://localhost:5177',
  'http://localhost:3000'
];

/**
 * Determines if the origin is allowed based on environment
 */
const isAllowedOrigin = (origin: string | undefined, isProd: boolean): boolean => {
  // Allow requests with no origin (like mobile apps, curl, Postman)
  if (!origin) return true;

  // In production, only allow the specific production origin
  if (isProd) {
    return origin === env.cors.productionOrigin;
  }

  // In development, first check explicitly allowed origins
  if (explicitlyAllowedOrigins.includes(origin)) {
    return true;
  }

  // Then check patterns for other local development origins
  // This means any localhost URL regardless of port will be allowed
  return allowedLocalPatterns.some(pattern => pattern.test(origin));
};

/**
 * CORS configuration options
 */
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const isProd = env.nodeEnv === 'production';

    if (isAllowedOrigin(origin, isProd)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsOptions;
