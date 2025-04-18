import { Request, Response, NextFunction } from 'express';
import { ApiError, formatError, InternalServerError } from '../utils/errors.js';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // If headers already sent, delegate to Express default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log complete error details for debugging
  console.error('ERROR DETAILS:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: `${req.method} ${req.path}`,
    body: req.body
  });

  // Log error with details
  logger.error(`${err.name}: ${err.message}`, {
    stack: env.nodeEnv !== 'production' ? err.stack : undefined,
    code: err instanceof ApiError ? err.statusCode : 500,
    path: `${req.method} ${req.path}`
  });

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    // Handle specific Prisma error codes
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        res.status(409).json(formatError(
          new ApiError(`Duplicate entry: ${err.meta?.target || 'A record with this data already exists'}`, 409)
        ));
        return;
      case 'P2025': // Record not found
        res.status(404).json(formatError(
          new ApiError('Resource not found', 404)
        ));
        return;
      default:
        res.status(400).json(formatError(
          new ApiError(`Database error: ${err.message}`, 400)
        ));
        return;
    }
  }

  if (err instanceof PrismaClientValidationError) {
    res.status(400).json(formatError(
      new ApiError(`Validation error: ${err.message}`, 400)
    ));
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(formatError(err));
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(formatError(
      new ApiError('Invalid token', 401)
    ));
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(formatError(
      new ApiError('Token expired', 401)
    ));
    return;
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    res.status(403).json(formatError(
      new ApiError(`CORS error: ${err.message}`, 403)
    ));
    return;
  }

  // Handle standard Error objects with specific error messages
  // This ensures all errors are properly formatted for the frontend
  if (err instanceof Error) {
    // Use a 400 status code for validation and business logic errors
    // This makes them show up as client errors rather than server errors
    const statusCode = 400;
    res.status(statusCode).json(formatError(
      new ApiError(err.message, statusCode)
    ));
    return;
  }

  // Handle truly unknown errors
  const serverError = new InternalServerError(
    env.nodeEnv === 'production'
      ? 'Internal server error'
      : 'Unknown server error - check server logs for details'
  );

  res.status(500).json(formatError(serverError));
}
