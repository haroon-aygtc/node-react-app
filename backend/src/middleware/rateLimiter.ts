import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Global rate limiter for all routes
 * Limits requests to 100 per 15 minutes per IP
 * Excludes auth routes for login and register
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per window
  standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: { message: 'Too many requests, please try again later', code: 429 } },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      path: req.path,
      method: req.method,
    });
    next(new RateLimitError());
  },
  // Skip rate limiting for login and register routes
  skip: (req, res) => {
    const authPaths = ['/api/auth/login', '/api/auth/register'];
    return authPaths.includes(req.path);
  }
});

/**
 * Stricter rate limiter for authentication routes
 * Limits requests to 10 per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many authentication attempts, please try again later', code: 429 } },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
      path: req.path,
      method: req.method,
    });
    next(new RateLimitError('Too many authentication attempts, please try again later'));
  },
});
