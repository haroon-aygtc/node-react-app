/**
 * Custom error classes and error handling utilities
 */

// Base API Error class
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 Conflict
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

// 422 Unprocessable Entity
export class ValidationError extends ApiError {
  errors?: Record<string, string[]>;
  
  constructor(message = 'Validation failed', errors?: Record<string, string[]>) {
    super(message, 422);
    this.errors = errors;
  }
}

// 429 Too Many Requests
export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

// Error response format
export interface ErrorResponse {
  error: {
    message: string;
    code: number;
    errors?: Record<string, string[]>;
  };
}

// Format error for response
export function formatError(error: Error): ErrorResponse {
  if (error instanceof ApiError) {
    return {
      error: {
        message: error.message,
        code: error.statusCode,
        ...(error instanceof ValidationError && error.errors ? { errors: error.errors } : {})
      }
    };
  }
  
  // Default to 500 for unknown errors
  return {
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message || 'Internal server error',
      code: 500
    }
  };
}
