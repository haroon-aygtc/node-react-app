import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import env from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import { safeNumberId } from '../utils/typeConverters.js';
import { verifyToken } from '../utils/jwt.js';

interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string; roles: string[]; permissions: string[] };
}

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Log request for debugging
    console.log('Register request body:', req.body);

    // Validate required fields
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      throw new BadRequestError('Email, password, and name are required');
    }

    // Register user
    const { user, token, refreshToken } = await authService.registerUser({
      email,
      password,
      name
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get user's roles and permissions
    let roles: string[] = [];

    try {
      const userRolesAndPermissions = await authService.getUserRolesAndPermissions(safeNumberId(user.id));
      roles = userRolesAndPermissions.roles;
      // We don't need permissions here
    } catch (rolesError) {
      console.error('Error getting user roles and permissions:', rolesError);
      // Continue with empty roles/permissions
    }

    // Prepare response
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: roles.length > 0 ? roles[0] : 'user' // Convert roles array to single role string
      },
      token,
      message: 'Registration successful'
    };

    // Log response for debugging
    console.log('Register response:', response);

    // Send response
    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error in controller:', error);

    // Send a more specific error response
    if (error instanceof BadRequestError || error instanceof Error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Registration failed',
        error: error.name
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred during registration',
        error: 'InternalServerError'
      });
    }
  }
});

/**
 * Logout a user
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
  });

  // Send response
  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Login a user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Log request for debugging
    console.log('Login request body:', req.body);

    // Validate required fields
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    // Login user
    const { user, token, refreshToken } = await authService.loginUser({
      email,
      password
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get user's roles and permissions
    const { roles } = await authService.getUserRolesAndPermissions(safeNumberId(user.id));

    // Prepare response
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: roles.length > 0 ? roles[0] : 'user' // Convert roles array to single role string
      },
      token
    };

    // Log response for debugging
    console.log('Login response:', response);

    // Send response
    res.status(200).json(response);
  } catch (error) {
    console.error('Login error in controller:', error);

    // Send a more specific error response
    if (error instanceof BadRequestError || error instanceof Error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Login failed',
        error: error.name
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred during login',
        error: 'InternalServerError'
      });
    }
  }
});

/**
 * Get current user
 */
/**
 * Refresh access token using refresh token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    // Verify refresh token
    const payload = verifyToken<{ userId: number }>(refreshToken);

    if (!payload || !payload.userId) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Get user
    const user = await authService.getUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens
    const newAccessToken = await authService.createAccessToken(user.id);
    const newRefreshToken = await authService.createRefreshToken(user.id);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get user's roles and permissions
    const { roles } = await authService.getUserRolesAndPermissions(safeNumberId(user.id));

    // Send response
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: roles.length > 0 ? roles[0] : 'user'
      },
      token: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    // Clear the invalid refresh token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
    });

    if (error instanceof UnauthorizedError || error instanceof Error) {
      res.status(401).json({
        status: 'error',
        message: error.message || 'Authentication failed',
        error: error.name
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        error: 'InternalServerError'
      });
    }
  }
});

/**
 * Get current user
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('User not authenticated');
    }

    // Get user
    const user = await authService.getUserById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Get user's roles and permissions
    const { roles, permissions } = await authService.getUserRolesAndPermissions(safeNumberId(user.id));

    // Send response
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: roles.length > 0 ? roles[0] : 'user', // Convert roles array to single role string
      permissions
    });
  } catch (error) {
    console.error('GetMe error in controller:', error);

    // Send a more specific error response
    if (error instanceof BadRequestError || error instanceof Error) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to get user information',
        error: error.name
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        error: 'InternalServerError'
      });
    }
  }
});
