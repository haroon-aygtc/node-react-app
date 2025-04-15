import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { BadRequestError, ConflictError } from '../utils/errors.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';

/**
 * Register a new user with admin role by default
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: User; token: string; refreshToken: string }> {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new BadRequestError('Invalid email format');
  }

  // Validate password
  if (data.password.length < 8) {
    throw new BadRequestError('Password must be at least 8 characters');
  }
  if (!/[a-zA-Z]/.test(data.password)) {
    throw new BadRequestError('Password must contain at least one letter');
  }
  if (!/[0-9]/.test(data.password)) {
    throw new BadRequestError('Password must contain at least one number');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user with admin role
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.name,
      role: 'admin' // Set role to admin by default
    }
  });

  // Generate tokens
  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return { user, token, refreshToken };
}

/**
 * Login a user
 */
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string; refreshToken: string }> {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  // Generate tokens
  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  return { user, token, refreshToken };
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
