import jwt, { Secret } from 'jsonwebtoken';
import env from '../config/env.js';
import { UnauthorizedError } from './errors.js';

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
export function createAccessToken(user: { id: string; email: string; role: string }): string {
  return signToken(
    { userId: user.id, email: user.email, role: user.role },
    '15m'
  );
}

/**
 * Create a refresh token for a user
 */
export function createRefreshToken(user: { id: string }): string {
  return signToken({ userId: user.id }, '7d'); // Set refresh token to expire in 7 days
}
