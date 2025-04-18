import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { BadRequestError, ConflictError } from '../utils/errors.js';
import { createAccessToken as createJwtAccessToken, createRefreshToken as createJwtRefreshToken } from '../utils/jwt.js';
import * as roleRepository from '../repositories/roleRepository.js';
import { convertEntityId, idParam, safeNumberId } from '../utils/typeConverters.js';

/**
 * Create an access token for a user
 */
export async function createAccessToken(userId: number): Promise<string> {
  return createJwtAccessToken({ id: userId });
}

/**
 * Create a refresh token for a user
 */
export async function createRefreshToken(userId: number): Promise<string> {
  return createJwtRefreshToken({ id: userId });
}

/**
 * Register a new user with default user role
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: User; token: string; refreshToken: string }> {
  try {
    console.log('Starting registration process for:', data.email);

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictError('Email already registered, please use a different email');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestError('Invalid email address, please enter a valid email address');
    }

    // Validate password
    if (data.password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters, please enter a stronger password');
    }
    if (!/[a-zA-Z]/.test(data.password)) {
      throw new BadRequestError('Password must contain at least one letter, please enter a stronger password');
    }
    if (!/[0-9]/.test(data.password)) {
      throw new BadRequestError('Password must contain at least one number, please enter a stronger password');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user in database');
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          fullName: data.name,
        }
      });
      console.log(`User created with ID: ${user.id}`);
    } catch (createError) {
      console.error('Error creating user:', createError);
      throw new BadRequestError('Failed to create user account. Please try again later.');
    }

    // Convert to type with number ID
    const convertedUser = convertEntityId(user);
    console.log(`Converted user ID: ${convertedUser.id}, type: ${typeof convertedUser.id}`);

    // Check if roles exist and create them if they don't
    try {
      // Create default roles if they don't exist
      // First, try to get the admin role
      let adminRole = await roleRepository.getRoleByName('admin');

      // If admin role doesn't exist, create it
      if (!adminRole) {
        console.log('Admin role not found, creating it...');
        try {
          adminRole = await prisma.role.create({
            data: {
              name: 'admin',
              description: 'System administrator with full access',
              isDefault: false,
              isSystem: true
            }
          });
          console.log(`Admin role created with ID: ${adminRole.id}`);
        } catch (createRoleError) {
          console.error('Error creating admin role:', createRoleError);
          // Try to get it again in case it was created by another process
          adminRole = await roleRepository.getRoleByName('admin');
          if (!adminRole) {
            throw new Error('Failed to create or find admin role');
          }
        }
      }

      // Next, try to get the user role
      let userRole = await roleRepository.getRoleByName('user');

      // If user role doesn't exist, create it
      if (!userRole) {
        console.log('User role not found, creating it...');
        try {
          userRole = await prisma.role.create({
            data: {
              name: 'user',
              description: 'Regular user with limited access',
              isDefault: true,
              isSystem: true
            }
          });
          console.log(`User role created with ID: ${userRole.id}`);
        } catch (createRoleError) {
          console.error('Error creating user role:', createRoleError);
          // Try to get it again in case it was created by another process
          userRole = await roleRepository.getRoleByName('user');
          if (!userRole) {
            throw new Error('Failed to create or find user role');
          }
        }
      }

      // Determine which role to assign (admin for first user, user for others)
      const userCount = await prisma.user.count();
      const roleToAssign = userCount <= 1 ? adminRole : userRole;
      console.log(`Using role: ${roleToAssign.name} for new user`);

      // Assign role to user
      console.log(`Assigning role ${roleToAssign.id} to user ${convertedUser.id}`);
      try {
        await roleRepository.assignRoleToUser(
          safeNumberId(convertedUser.id),
          safeNumberId(roleToAssign.id)
        );
        console.log('Role assigned successfully');
      } catch (assignRoleError) {
        console.error('Error assigning role to user:', assignRoleError);
        // We'll continue even if role assignment fails
      }
    } catch (roleError) {
      console.error('Error handling roles:', roleError);
      // Continue even if role assignment fails, to help debug
    }

    // Generate tokens
    console.log('Generating access token');
    const token = await createAccessToken(convertedUser.id);
    console.log('Generating refresh token');
    const refreshToken = await createRefreshToken(convertedUser.id);
    console.log('Tokens generated successfully');

    return { user, token, refreshToken };
  } catch (error) {
    console.error('Registration process error:', error);
    throw error;
  }
}

/**
 * Login a user
 */
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string; refreshToken: string }> {
  console.log('Login attempt for:', data.email);

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  console.log('User found:', !!user);

  if (!user) {
    throw new BadRequestError('Invalid email or password, please check your credentials and try again');
  }

  // Verify password
  console.log('Comparing password...');
  console.log('Password hash from DB:', user.passwordHash.substring(0, 10) + '...');

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  console.log('Password valid:', isPasswordValid);

  if (!isPasswordValid) {
    throw new BadRequestError('Invalid email or password, please check your credentials and try again');
  }

  // Convert to type with number ID
  const convertedUser = convertEntityId(user);

  // Generate tokens
  const token = await createAccessToken(convertedUser.id);
  const refreshToken = await createRefreshToken(convertedUser.id);

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  return { user, token, refreshToken };
}

/**
 * Get user by ID with roles and permissions
 */
export async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: idParam(id) }
  });

  return user ? convertEntityId(user) : null;
}

/**
 * Get user's roles and permissions
 */
export async function getUserRolesAndPermissions(userId: number): Promise<{
  roles: string[];
  permissions: string[];
}> {
  const user = await prisma.user.findUnique({
    where: { id: idParam(userId) }
  });

  if (!user) {
    throw new BadRequestError('User not found, please contact support');
  }

  // Get roles and permissions with a raw query
  const roleResults = await prisma.$queryRaw<Array<{ roleName: string; permissionName: string }>>(Prisma.sql`
    SELECT r.name as roleName, p.name as permissionName
    FROM UserRole ur
    JOIN Role r ON ur.roleId = r.id
    LEFT JOIN RolePermission rp ON r.id = rp.roleId
    LEFT JOIN Permission p ON rp.permissionId = p.id
    WHERE ur.userId = ${userId}
  `);

  const roles: string[] = [];
  const permissions: string[] = [];

  roleResults.forEach(row => {
    if (row.roleName && !roles.includes(row.roleName)) {
      roles.push(row.roleName);
    }

    if (row.permissionName && !permissions.includes(row.permissionName)) {
      permissions.push(row.permissionName);
    }
  });

  return {
    roles,
    permissions
  };
}
