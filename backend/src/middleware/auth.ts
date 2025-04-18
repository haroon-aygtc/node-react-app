import { Request, Response, NextFunction } from 'express'; // eslint-disable-line no-unused-vars
import prisma from '../config/prisma.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';
import * as authService from '../services/authService.js';

// Extended Request interface with user and permissions properties
export interface AuthRequest extends Request {
  user?: any;
  permissions?: string[];
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header and loads user with roles
 */
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    // Verify token
    const payload = verifyToken<{ userId: number; email: string }>(token);

    // Get user's roles and permissions
    const { roles, permissions } = await authService.getUserRolesAndPermissions(payload.userId);

    // Add user and permissions to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      roles,
      permissions
    };

    // Also add permissions directly to the request for easier access
    req.permissions = permissions;

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
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRoles = req.user.roles || [];

      // Check if user has at least one of the required roles
      const hasRole = roles.some(role => userRoles.includes(role));

      if (!hasRole) {
        throw new UnauthorizedError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};

/**
 * Permission-based authorization middleware
 * Must be used after authenticate middleware
 */
export const hasPermission = (requiredPermissions: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userPermissions = req.user.permissions || [];

      // Check if user has at least one of the required permissions
      const hasRequiredPermissions = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasRequiredPermissions) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};

/**
 * Permission-based authorization middleware that requires any of the specified permissions
 * Must be used after authenticate middleware
 */
export const hasAnyPermission = (requiredPermissions: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userPermissions = req.user.permissions || [];

      // Check if user has any of the required permissions
      const hasAnyPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        throw new UnauthorizedError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};

/**
 * Check if user is admin
 * Must be used after authenticate middleware
 */
export const isAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!req.user.roles.includes('admin')) {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
};
