import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import env from '../config/env.js';
import { UnauthorizedError } from './errors.js';
import prisma from '../config/prisma.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { User } from '../models/index.js';
import { idParam } from './typeConverters.js';

/**
 * Sign a JWT token with the given payload
 */
export function signToken(
  payload: Record<string, any>,
  expiresIn: '15m' | '1h' | '24h' | '7d' = '15m'
): string {
  return jwt.sign(payload, env.jwt.secret as Secret, { expiresIn });
}

/**
 * Verify a JWT token and return the decoded payload
 * @throws {UnauthorizedError} If the token is invalid or expired
 */
export function verifyToken<T = any>(token: string): T {
  try {
    return jwt.verify(token, env.jwt.secret as jwt.Secret) as T;
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    throw error;
  }
}

/**
 * Create an access token for a user
 */
export async function createAccessToken(user: { id: number }): Promise<string> {
  try {
    console.log(`Creating access token for user ID: ${user.id}`);

    // Get user data
    const userData = await prisma.user.findUnique({
      where: { id: idParam(user.id) }
    });

    if (!userData) {
      console.error(`User with ID ${user.id} not found when creating access token`);
      throw new UnauthorizedError('User not found');
    }

    console.log(`User found: ${userData.email}`);

    // Get user roles with raw query
    try {
      console.log(`Fetching roles for user ID: ${user.id}`);
      const rolesResult = await prisma.$queryRaw<Array<{ name: string }>>(
        Prisma.sql`
          SELECT r.name
          FROM UserRole ur
          JOIN Role r ON ur.roleId = r.id
          WHERE ur.userId = ${user.id}
        `
      );

      console.log(`Retrieved ${rolesResult.length} roles for user`);

      // Extract roles and ensure they are strings
      const roles = rolesResult.map(r => String(r.name));
      console.log(`User roles: ${roles.join(', ')}`);

      // Create token with user info and roles
      return signToken(
        {
          userId: user.id,
          email: userData.email,
          roles
        },
        '15m'
      );
    } catch (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      // Fall back to token without roles
      console.log('Creating token without roles due to error');
      return signToken(
        {
          userId: user.id,
          email: userData.email,
          roles: []
        },
        '15m'
      );
    }
  } catch (error) {
    console.error('Error in createAccessToken:', error);
    // Last resort fallback - create a basic token with just the user ID
    return signToken({ userId: user.id }, '15m');
  }
}

/**
 * Create a refresh token for a user
 */
export async function createRefreshToken(user: { id: number }): Promise<string> {
  return signToken({ userId: user.id }, '7d'); // Set refresh token to expire in 7 days
}
