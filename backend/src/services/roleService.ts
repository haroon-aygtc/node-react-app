import prisma from '../config/prisma.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import * as roleRepository from '../repositories/roleRepository.js';
import type { Role, Permission } from '../models/index.js';
import { idParam, safeNumberId } from '../utils/typeConverters.js';
/**
 * Get all roles with their permissions
 */
export async function getAllRoles() {
  // Get all roles from repository
  const roles = await roleRepository.getAllRoles();

  // Get user counts for each role in a single query for better performance
  const roleCounts = await prisma.$queryRaw`
    SELECT roleId, COUNT(userId) as userCount
    FROM UserRole
    GROUP BY roleId
  `;

  // Create a map of role ID to user count
  const roleCountMap = (roleCounts as any[]).reduce((acc: Record<number, number>, row) => {
    acc[row.roleId] = Number(row.userCount);
    return acc;
  }, {});

  // Format the response to be more user-friendly
  return roles.map((role: any) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    isDefault: role.isDefault,
    isSystem: role.isSystem,
    permissions: role.rolePermissions.map((rp: any) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      description: rp.permission.description,
      category: rp.permission.category,
      action: rp.permission.action
    })),
    userCount: roleCountMap[role.id] || 0, // Add user count
    createdAt: role.createdAt,
    updatedAt: role.updatedAt
  }));
}

/**
 * Get a role by ID with its permissions
 */
export async function getRoleById(id: string) {
  // Get role with permissions
  const role = await roleRepository.getRoleById(safeNumberId(id));

  // Note: We're not using roleRepository.getRoleById() here because we need to include permissions

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Get user count for this role
  const userCount = await prisma.userRole.count({
    where: { roleId: idParam(safeNumberId(id)) }
  });

  // Format the response
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isDefault: role.isDefault,
    isSystem: role.isSystem,
    permissions: role.rolePermissions?.map((rp: any) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      description: rp.permission.description,
      category: rp.permission.category,
      action: rp.permission.action
    })),
    userCount, // Add user count
    createdAt: role.createdAt,
    updatedAt: role.updatedAt
  };
}

/**
 * Create a new role
 */
export async function createRole(data: {
  name: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}) {
  const { name, description, isDefault = false, permissionIds = [] } = data;

  if (!name) {
    throw new BadRequestError('Role name is required');
  }

  // Check if role with the same name already exists
  const existingRole = await roleRepository.getRoleByName(name);

  if (existingRole) {
    throw new BadRequestError('Role with this name already exists');
  }

  // Create the role
  const role = await roleRepository.createRole({
    name,
    description,
    isDefault
  });

  // Assign permissions if provided
  if (permissionIds.length > 0) {
    // Verify all permissions exist
    const permissions = await roleRepository.getPermissionsByIds(permissionIds.map(id => safeNumberId(id)));

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestError('Some permission IDs are invalid');
    }

    // Create role-permission associations
    await Promise.all(permissionIds.map(permissionId =>
      roleRepository.createRolePermission(role.id, safeNumberId(permissionId))
    ));
  }

  // Return the created role with permissions
  return getRoleById(idParam(role.id));
}

/**
 * Update a role
 */
export async function updateRole(id: string, data: {
  name?: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}) {
  const { name, description, isDefault, permissionIds } = data;

  // Check if role exists
  const existingRole = await roleRepository.getRoleById(safeNumberId(id));

  if (!existingRole) {
    throw new NotFoundError('Role not found');
  }

  // Check if name is unique if changing
  if (name && name !== existingRole.name) {
    const roleWithSameName = await roleRepository.getRoleByName(name);

    if (roleWithSameName) {
      throw new BadRequestError('Role with this name already exists');
    }
  }

  // Update role
  await roleRepository.updateRole(safeNumberId(id), {
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(isDefault !== undefined && { isDefault })
  });

  // Update permissions if provided
  if (permissionIds) {
    // Verify all permissions exist
    const permissions = await roleRepository.getPermissionsByIds(permissionIds.map(id => safeNumberId(id)));

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestError('Some permission IDs are invalid');
    }

    // Delete existing role-permission associations
    await roleRepository.getRolePermissions(safeNumberId(id));

    // Create new role-permission associations
    await Promise.all(permissionIds.map(permissionId =>
      roleRepository.createRolePermission(safeNumberId(id), safeNumberId(permissionId))
    ));
  }

  // Return the updated role with permissions
  return getRoleById(id);
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<void> {
  // Check if role exists
  const existingRole = await roleRepository.getRoleById(safeNumberId(id));

  if (!existingRole) {
    throw new NotFoundError('Role not found');
  }

  // Check if role is in use
  const userRoleCount = await prisma.userRole.count({
    where: { roleId: idParam(safeNumberId(id)) }
  });

  if (userRoleCount > 0) {
    throw new BadRequestError('Cannot delete role as it is assigned to users');
  }

  if (!existingRole.isSystem) {
    // Delete role-permission associations first
    await roleRepository.deleteRolePermissions(safeNumberId(id));
    // Delete the role
    await roleRepository.deleteRole(safeNumberId(id));
  }
}

/**
 * Get all permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
  // Get all permissions
  return roleRepository.getAllPermissions();

  // Note: We don't have a permissionRepository yet, so we're using Prisma directly
}

/**
 * Get a permission by ID
 */
export async function getPermissionById(id: string): Promise<Permission | null> {
  // Get permission by ID
  const permission = await roleRepository.getPermissionById(safeNumberId(id));

  if (!permission) {
    throw new NotFoundError('Permission not found');
  }

  // Note: We don't have a permissionRepository yet, so we're using Prisma directly
  return permission;
}

/**
 * Assign permissions to a role
 */
export async function assignPermissions(roleId: string, permissionIds: string[]) {
  if (!roleId || !permissionIds || !Array.isArray(permissionIds)) {
    throw new BadRequestError('Role ID and permission IDs array are required');
  }

  // Check if role exists
  const role = await roleRepository.getRoleById(safeNumberId(roleId));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Verify all permissions exist
  const permissions = await roleRepository.getPermissionsByIds(permissionIds.map(id => safeNumberId(id)));

  if (permissions.length !== permissionIds.length) {
    throw new BadRequestError('Some permission IDs are invalid');
  }

  // Create role-permission associations
  const results = await Promise.all(permissionIds.map(async (permissionId) => {
    return roleRepository.createRolePermission(safeNumberId(roleId), safeNumberId(permissionId));
  }));

  return {
    message: 'Permissions assigned successfully',
    roleId,
    permissionsAssigned: results.length
  };
}

/**
 * Get users by role ID
 */
export async function getUsersByRoleId(roleId: string) {
  // Check if role exists
  const role = await roleRepository.getRoleById(safeNumberId(roleId));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Get users with this role
  const userRoles = await roleRepository.getUsersByRoleId(safeNumberId(roleId));

  // Format the response
  return userRoles.map((ur: any) => ({
    id: ur.user.id,
    email: ur.user.email,
    fullName: ur.user.fullName,
    assignedAt: ur.assignedAt
  }));
}

/**
 * Assign role to a user
 */
export async function assignRoleToUser(userId: string, roleId: string) {
  // Check if role exists
  const role = await roleRepository.getRoleById(safeNumberId(roleId));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Check if user exists
  const user = await roleRepository.getUserById(safeNumberId(userId));

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if user already has this role
  const existingUserRole = await roleRepository.getUserRole(safeNumberId(userId), safeNumberId(roleId));

  if (existingUserRole) {
    return {
      message: 'User already has this role',
      userId,
      roleId
    };
  }

  // Assign role to user
  await roleRepository.assignRoleToUser(safeNumberId(userId), safeNumberId(roleId));

  return {
    message: 'Role assigned to user successfully',
    userId,
    roleId
  };
}

/**
 * Remove role from a user
 */
export async function removeRoleFromUser(userId: string, roleId: string) {
  // Check if role exists
  const role = await roleRepository.getRoleById(safeNumberId(roleId));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Check if user exists
  const user = await roleRepository.getUserById(safeNumberId(userId));

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if user has this role
  const existingUserRole = await roleRepository.getUserRole(safeNumberId(userId), safeNumberId(roleId));

  if (!existingUserRole) {
    return {
      message: 'User does not have this role',
      userId,
      roleId
    };
  }

  // Remove role from user
  await roleRepository.removeRoleFromUser(safeNumberId(userId), safeNumberId(roleId));

  return {
    message: 'Role removed from user successfully',
    userId,
    roleId
  };
}

/**
 * Remove a permission from a role
 */
export async function removePermissionFromRole(roleId: string, permissionId: string) {
  // Check if role exists
  const role = await roleRepository.getRoleById(safeNumberId(roleId));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Check if permission exists
  const permission = await roleRepository.getPermissionById(safeNumberId(permissionId));

  if (!permission) {
    throw new NotFoundError('Permission not found');
  }

  // Check if role has this permission
  const rolePermissions = await roleRepository.getRolePermissions(safeNumberId(roleId));
  const hasPermission = rolePermissions.some(rp => rp.permissionId === safeNumberId(permissionId));

  if (!hasPermission) {
    return {
      message: 'Role does not have this permission',
      roleId,
      permissionId
    };
  }

    // Remove permission from role
  await roleRepository.removePermissionFromRole(safeNumberId(roleId), safeNumberId(permissionId));

  return {
    message: 'Permission removed from role successfully',
    roleId,
    permissionId
  };
}

/**
 * Get permissions by an array of IDs
 */
export async function getPermissionsByIds(ids: string[]): Promise<Permission[]> {
  if (!ids || !Array.isArray(ids)) {
    throw new BadRequestError('Valid permission IDs array is required');
  }

  return roleRepository.getPermissionsByIds(ids.map(id => safeNumberId(id)));
}
