import prisma from '../config/prisma.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import * as userRepository from '../repositories/userRepository.js';
import { Prisma } from '@prisma/client';
import * as roleRepository from '../repositories/roleRepository.js';

/**
 * Get a user by ID with roles and permissions
 */
export async function getUserById(id: number) {
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Get user roles
  const userRoles = await prisma.$queryRaw(Prisma.sql`
    SELECT ur.id, r.id as roleId, r.name, r.description
    FROM UserRole ur
    JOIN Role r ON ur.roleId = r.id
    WHERE ur.userId = ${id}
  `);

  // Format user data
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: (userRoles as any[]).map((ur) => ({
      id: ur.roleId,
      name: ur.name,
      description: ur.description
    }))
  };
}

/**
 * Get all users with their roles
 */
export async function getAllUsers() {
  const users = await userRepository.getAllUsers();

  // Get all user roles in a single query for better performance
  const userRoles = await prisma.$queryRaw(Prisma.sql`
    SELECT ur.userId, r.id as roleId, r.name, r.description
    FROM UserRole ur
    JOIN Role r ON ur.roleId = r.id
  `);

  // Group roles by userId
  const userRolesMap = (userRoles as any[]).reduce((acc: Record<string, any[]>, ur) => {
    if (!acc[ur.userId]) {
      acc[ur.userId] = [];
    }
    acc[ur.userId].push({
      id: ur.roleId,
      name: ur.name,
      description: ur.description
    });
    return acc;
  }, {});

  // Format user data
  return users.map(user => ({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: userRolesMap[user.id] || []
  }));
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  password: string;
  fullName: string | null;
  isActive?: boolean;
  roleIds?: number[];
}) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new BadRequestError('Email already registered');
  }

  // Hash password
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      isActive: data.isActive !== undefined ? data.isActive : true,
      emailVerified: false
    }
  });

  // Assign roles if provided
  if (data.roleIds && data.roleIds.length > 0) {
    await assignRolesToUser(user.id, data.roleIds);
  } else {
    // Assign default user role if no roles provided
    try {
      const defaultRole = await prisma.role.findFirst({
        where: { isDefault: true }
      });

      if (defaultRole) {
        await assignRolesToUser(user.id, [defaultRole.id]);
      }
    } catch (error) {
      console.error('Error assigning default role:', error);
      // Continue even if default role assignment fails
    }
  }

  // Get user with roles
  return getUserById(user.id);
}

/**
 * Assign roles to a user
 */
/**
 * Assign roles to a user (replace all roles)
 */
export async function assignRolesToUser(userId: number, roleIds: number[]) {
  // Check if user exists
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify all roles exist
  const roles = await prisma.$queryRaw(Prisma.sql`
    SELECT id FROM Role WHERE id IN (${roleIds.join(',')})
  `);

  if ((roles as any[]).length !== roleIds.length) {
    throw new BadRequestError('Some role IDs are invalid');
  }

  // Delete existing user-role associations
  await roleRepository.replaceUserRoles(userId, roleIds);
  return {
    userId,
    rolesAssigned: roleIds.length
  };
}

/**
 * Get user's roles
 */
export async function getUserRoles(userId: number) {
  // Check if user exists
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userRoles = await userRepository.getUserRoles(userId);
  return userRoles.map(ur => ur.role);
}

/**
 * Add a role to a user
 */
/**
 * Add a role to a user
 */
export async function addRoleToUser(userId: number, roleId: number) {
  // Check if user exists
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if role exists
  const role = await prisma.$queryRaw(Prisma.sql`SELECT * FROM Role WHERE id = ${roleId} LIMIT 1`);

  if (!(role as any[])[0]) {
    throw new NotFoundError('Role not found');
  }

  // Check if user already has this role
  const existingUserRole = await prisma.$queryRaw(Prisma.sql`
    SELECT * FROM UserRole WHERE userId = ${userId} AND roleId = ${roleId} LIMIT 1
  `);

  if ((existingUserRole as any[])[0]) {
    return {
      message: 'User already has this role',
      userId,
      roleId
    };
  }

  // Add role to user
  await roleRepository.assignRoleToUser(userId, roleId);
  return {
    message: 'Role added to user successfully',
    userId,
    roleId
  };
}

/**
 * Remove a role from a user
 */
/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(userId: number, roleId: number) {
  // Check if user exists
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if role exists
  const role = await prisma.$queryRaw(Prisma.sql`SELECT * FROM Role WHERE id = ${roleId} LIMIT 1`);

  if (!(role as any[])[0]) {
    throw new NotFoundError('Role not found');
  }

  // Check if user has this role
  const existingUserRole = await prisma.$queryRaw(Prisma.sql`
    SELECT * FROM UserRole WHERE userId = ${userId} AND roleId = ${roleId} LIMIT 1
  `);

  if (!(existingUserRole as any[])[0]) {
    return {
      message: 'User does not have this role',
      userId,
      roleId
    };
  }

  // Remove role from user
  await roleRepository.removeRoleFromUser(userId, roleId);
  return {
    message: 'Role removed from user successfully',
    userId,
    roleId
  };
}
