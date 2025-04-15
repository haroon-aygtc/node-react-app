import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async controller function to catch errors and pass them to the error handler
 * This eliminates the need for try/catch blocks in every controller
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
