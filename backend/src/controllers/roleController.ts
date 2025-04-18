import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError } from '../utils/errors.js';
import * as roleService from '../services/roleService.js';

/**
 * Get all roles with their permissions
 */
export const getAllRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await roleService.getAllRoles();
  res.json(roles);
});

/**
 * Get a role by ID with its permissions
 */
export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.getRoleById(req.params.id);
  res.json(role);
});

/**
 * Create a new role
 */
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, isDefault, permissionIds } = req.body;
  const role = await roleService.createRole({
    name,
    description,
    isDefault,
    permissionIds,
  });
  res.status(201).json(role);
});

/**
 * Update a role
 */
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, isDefault, permissionIds } = req.body;
  const roleId = req.params.id;

  const updatedRole = await roleService.updateRole(roleId, {
    name,
    description,
    isDefault,
    permissionIds,
  });

  res.json(updatedRole);
});

/**
 * Delete a role
 */
export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  await roleService.deleteRole(req.params.id);
  res.status(204).send();
});

/**
 * Get all permissions
 */
export const getAllPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await roleService.getAllPermissions();
  res.json(permissions);
});

/**
 * Get a permission by ID
 */
export const getPermissionById = asyncHandler(async (req: Request, res: Response) => {
  const permission = await roleService.getPermissionById(req.params.id);
  res.json(permission);
});

/**
 * Assign permissions to a role
 */
export const assignPermissions = asyncHandler(async (req: Request, res: Response) => {
  const { roleId, permissionIds } = req.body;
  const result = await roleService.assignPermissions(roleId, permissionIds);
  res.json(result);
});

/**
 * Get users by role ID
 */
export const getUsersByRoleId = asyncHandler(async (req: Request, res: Response) => {
  const users = await roleService.getUsersByRoleId(req.params.id);
  res.json(users);
});

/**
 * Assign role to a user
 */
export const assignRoleToUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const result = await roleService.assignRoleToUser(userId, req.params.id);
  res.json(result);
});

/**
 * Remove role from a user
 */
export const removeRoleFromUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const result = await roleService.removeRoleFromUser(userId, req.params.id);
  res.json(result);
});
