import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import * as roleService from '../services/roleService.js';
import * as permissionService from '../services/permissionService.js';
import * as roleRepository from '../repositories/roleRepository.js';
import { safeNumberId } from '../utils/typeConverters.js';

export const getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Check if category filter is provided
        const category = req.params.category || req.query.category as string;

        // Get all permissions
        const permissions = await permissionService.getAllPermissions();

        // Filter by category if provided
        if (category) {
            const filteredPermissions = permissions.filter(p =>
                p.category && p.category.toLowerCase() === category.toLowerCase()
            );
            return res.json(filteredPermissions);
        }

        // Return all permissions if no category filter
        res.json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Failed to fetch permissions', error: error.message });
    }
});

export const getPermissionById = asyncHandler(async (req: Request, res: Response) => {
    try {
        const permission = await permissionService.getPermissionById(Number(req.params.id));
        res.json(permission);
    } catch (error) {
        console.error(`Error fetching permission ${req.params.id}:`, error);
        if (error instanceof NotFoundError) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to fetch permission', error: error.message });
        }
    }
});

export const getPermissionsByIds = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: 'ids must be an array' });
        }

        // Convert string IDs to numbers
        const numericIds = ids.map(id => Number(id));
        const permissions = await permissionService.getPermissionsByIds(numericIds);
        res.json(permissions);
    } catch (error) {
        console.error('Error fetching permissions by IDs:', error);
        res.status(500).json({ message: 'Failed to fetch permissions', error: error.message });
    }
});

export const assignPermissionsToRole = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { roleId, permissionId } = req.body;

        if (!roleId || !permissionId) {
            throw new BadRequestError('Role ID and permission ID are required');
        }

        // Convert IDs to numbers
        const numericRoleId = Number(roleId);
        const numericPermissionId = Number(permissionId);

        // Check if role exists
        const role = await roleService.getRoleById(numericRoleId);
        if (!role) {
            throw new NotFoundError(`Role with ID ${roleId} not found`);
        }

        // Check if permission exists
        const permission = await permissionService.getPermissionById(numericPermissionId);
        if (!permission) {
            throw new NotFoundError(`Permission with ID ${permissionId} not found`);
        }

        const result = await roleService.assignPermissions(numericRoleId, [numericPermissionId]);
        res.json(result);
    } catch (error) {
        console.error('Error assigning permission to role:', error);
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            res.status(error instanceof BadRequestError ? 400 : 404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to assign permission to role', error: error.message });
        }
    }
});

export const assignMultiplePermissionsToRole = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { roleId, permissionIds } = req.body;

        if (!roleId || !permissionIds || !Array.isArray(permissionIds)) {
            throw new BadRequestError('Role ID and permission IDs array are required');
        }

        // Convert IDs to numbers
        const numericRoleId = Number(roleId);
        const numericPermissionIds = permissionIds.map(id => Number(id));

        // Check if role exists
        const role = await roleService.getRoleById(numericRoleId);
        if (!role) {
            throw new NotFoundError(`Role with ID ${roleId} not found`);
        }

        // Check if all permissions exist
        for (const permId of numericPermissionIds) {
            try {
                await permissionService.getPermissionById(permId);
            } catch (error) {
                throw new NotFoundError(`Permission with ID ${permId} not found`);
            }
        }

        const result = await roleService.assignPermissions(numericRoleId, numericPermissionIds);
        res.json(result);
    } catch (error) {
        console.error('Error assigning multiple permissions to role:', error);
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            res.status(error instanceof BadRequestError ? 400 : 404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to assign permissions to role', error: error.message });
        }
    }
});

export const assignPermissionsToUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, permissionIds } = req.body;

        if (!userId || !permissionIds || !Array.isArray(permissionIds)) {
            throw new BadRequestError('User ID and permission IDs array are required');
        }

        // Convert IDs to numbers
        const numericUserId = Number(userId);
        const numericPermissionIds = permissionIds.map(id => Number(id));

        // Check if user exists
        const user = await roleRepository.getUserById(numericUserId);
        if (!user) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }

        // Check if all permissions exist
        for (const permId of numericPermissionIds) {
            try {
                await permissionService.getPermissionById(permId);
            } catch (error) {
                throw new NotFoundError(`Permission with ID ${permId} not found`);
            }
        }

        const result = await roleService.assignPermissions(numericUserId, numericPermissionIds);
        res.json(result);
    } catch (error) {
        console.error('Error assigning permissions to user:', error);
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            res.status(error instanceof BadRequestError ? 400 : 404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to assign permissions to user', error: error.message });
        }
    }
});

export const getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
    try {
        const numericRoleId = Number(req.params.roleId);
        const role = await roleService.getRoleById(numericRoleId);

        if (!role) {
            throw new NotFoundError(`Role with ID ${req.params.roleId} not found`);
        }

        // Extract permissions from role
        const permissions = role.rolePermissions?.map(rp => rp.permission) || [];
        res.json(permissions);
    } catch (error) {
        console.error(`Error fetching permissions for role ${req.params.roleId}:`, error);
        if (error instanceof NotFoundError) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to fetch role permissions', error: error.message });
        }
    }
});

export const removePermissionFromRole = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { roleId, permissionId } = req.params;

        if (!roleId || !permissionId) {
            throw new BadRequestError('Role ID and permission ID are required');
        }

        // Convert IDs to numbers
        const numericRoleId = Number(roleId);
        const numericPermissionId = Number(permissionId);

        // Check if role exists
        const role = await roleService.getRoleById(numericRoleId);
        if (!role) {
            throw new NotFoundError(`Role with ID ${roleId} not found`);
        }

        // Check if permission exists
        try {
            await permissionService.getPermissionById(numericPermissionId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            // If it's another error, we'll continue anyway
        }

        await roleService.removePermissionFromRole(numericRoleId, numericPermissionId);
        res.json({ message: 'Permission removed from role successfully' });
    } catch (error) {
        console.error(`Error removing permission ${req.params.permissionId} from role ${req.params.roleId}:`, error);
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            res.status(error instanceof BadRequestError ? 400 : 404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to remove permission from role', error: error.message });
        }
    }
});
