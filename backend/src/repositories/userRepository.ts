import prisma from '../config/prisma.js';
import type { User, UserRole, Role } from '../models/index.js';
import { convertEntityId, convertEntityIds, idParam, safeNumberId } from '../utils/typeConverters.js';

export async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: idParam(id) },
    include: {
      userRoles: {
        include: {
          role: { include: { rolePermissions: true } }
        }
      }
    }
  });

  if (!user) return null;

  // Convert the main user
  const convertedUser = convertEntityId(user);

  // Create correctly typed User object
  const typedUser: User = {
    ...convertedUser,
    userRoles: user.userRoles.map(ur => ({
      userId: safeNumberId(ur.userId),
      roleId: safeNumberId(ur.roleId),
      assignedAt: ur.assignedAt,
      assignedBy: ur.assignedBy ? safeNumberId(ur.assignedBy) : null,
      createdAt: ur.createdAt,
      role: ur.role ? {
        ...convertEntityId(ur.role),
        rolePermissions: Array.isArray(ur.role.rolePermissions)
          ? ur.role.rolePermissions.map(rp => ({
              roleId: safeNumberId(rp.roleId),
              permissionId: safeNumberId(rp.permissionId),
              assignedAt: rp.assignedAt || new Date(),
              assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
              createdAt: rp.createdAt
            }))
          : []
      } : undefined
    }))
  };

  return typedUser;
}

export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: true
            }
          }
        }
      }
    }
  });

  return users.map(user => {
    // Convert main entity
    const convertedUser = convertEntityId(user);

    // Create correctly typed User
    const typedUser: User = {
      ...convertedUser,
      userRoles: user.userRoles.map(ur => ({
        userId: safeNumberId(ur.userId),
        roleId: safeNumberId(ur.roleId),
        assignedAt: ur.assignedAt,
        assignedBy: ur.assignedBy ? safeNumberId(ur.assignedBy) : null,
        createdAt: ur.createdAt,
        role: ur.role ? {
          ...convertEntityId(ur.role),
          rolePermissions: Array.isArray(ur.role.rolePermissions)
            ? ur.role.rolePermissions.map(rp => ({
                roleId: safeNumberId(rp.roleId),
                permissionId: safeNumberId(rp.permissionId),
                assignedAt: rp.assignedAt || new Date(),
                assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
                createdAt: rp.createdAt
              }))
            : []
        } : undefined
      }))
    };

    return typedUser;
  });
}

export async function createUser(data: Partial<User>): Promise<User> {
  // Enforce required fields for production safety
  if (!data.email || !data.passwordHash) {
    throw new Error('Missing required fields: email and passwordHash');
  }
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName ?? null,
      isActive: data.isActive ?? true,
      emailVerified: data.emailVerified ?? false,
      avatarUrl: data.avatarUrl ?? null,
      metadata: data.metadata ?? {},
      lastLoginAt: data.lastLoginAt ?? null
    }
  });

  // Convert to proper User type with empty userRoles array
  const typedUser: User = {
    ...convertEntityId(user),
    userRoles: []
  };

  return typedUser;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const user = await prisma.user.update({
    where: { id: idParam(id) },
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      isActive: data.isActive,
      emailVerified: data.emailVerified,
      avatarUrl: data.avatarUrl,
      metadata: data.metadata as any, // Type assertion to handle JSON
      lastLoginAt: data.lastLoginAt
    },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: true
            }
          }
        }
      }
    }
  });

  // Convert to proper User type with converted IDs
  const typedUser: User = {
    ...convertEntityId(user),
    userRoles: user.userRoles.map(ur => ({
      userId: safeNumberId(ur.userId),
      roleId: safeNumberId(ur.roleId),
      assignedAt: ur.assignedAt,
      assignedBy: ur.assignedBy ? safeNumberId(ur.assignedBy) : null,
      createdAt: ur.createdAt,
      role: ur.role ? {
        ...convertEntityId(ur.role),
        rolePermissions: Array.isArray(ur.role.rolePermissions)
          ? ur.role.rolePermissions.map(rp => ({
              roleId: safeNumberId(rp.roleId),
              permissionId: safeNumberId(rp.permissionId),
              assignedAt: rp.assignedAt || new Date(),
              assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
              createdAt: rp.createdAt
            }))
          : []
      } : undefined
    }))
  };

  return typedUser;
}

export async function deleteUser(id: number): Promise<void> {
  await prisma.user.delete({ where: { id: idParam(id) } });
}

export async function getUserRoles(userId: number): Promise<UserRole[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId: idParam(userId) },
    include: {
      role: {
        include: {
          rolePermissions: true
        }
      }
    }
  });

  // Map to proper UserRole[] type
  return userRoles.map(ur => {
    const { userId, roleId, assignedAt, assignedBy, createdAt, role } = ur;
    let safeRole = undefined;

    if (role) {
      safeRole = {
        id: safeNumberId(role.id),
        name: role.name,
        description: role.description,
        isDefault: role.isDefault,
        isSystem: role.isSystem,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        rolePermissions: Array.isArray(role.rolePermissions)
          ? role.rolePermissions.map(rp => ({
              roleId: safeNumberId(rp.roleId),
              permissionId: safeNumberId(rp.permissionId),
              assignedAt: rp.assignedAt || new Date(),
              assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
              createdAt: rp.createdAt
            }))
          : []
      };
    }

    return {
      userId: safeNumberId(userId),
      roleId: safeNumberId(roleId),
      assignedAt,
      assignedBy: assignedBy ? safeNumberId(assignedBy) : null,
      createdAt,
      role: safeRole
    };
  });
}
