import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { UnauthorizedError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';

// Extended Request interface with user property
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Authentication required');
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const payload = verifyToken<{ userId: string }>(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid authentication');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
};

/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};
