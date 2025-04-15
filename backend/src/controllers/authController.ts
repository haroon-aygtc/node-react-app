import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import env from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError } from '../utils/errors.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Log request for debugging
  console.log('Register request body:', req.body);

  // Validate required fields
  const { email, password, name, fullName } = req.body;
  // Support both name and fullName fields for backward compatibility
  const displayName = name || fullName;
  if (!email || !password || !displayName) {
    throw new BadRequestError('Email, password, and name are required');
  }

  // Register user
  const { user, token, refreshToken } = await authService.registerUser({
    email,
    password,
    name: displayName
  });

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Prepare response
  const response = {
    user: {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role
    },
    token,
    message: 'Registration successful'
  };

  // Log response for debugging
  console.log('Register response:', response);

  // Send response
  res.status(201).json(response);
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

  // Prepare response
  const response = {
    user: {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role
    },
    token
  };

  // Log response for debugging
  console.log('Login response:', response);

  // Send response
  res.status(200).json(response);
});



/**
 * Get current user
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  // Send response
  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: user.role
  });
});
