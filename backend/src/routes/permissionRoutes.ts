import { Router } from 'express';
import * as permissionController from '../controllers/permissionController.js';
import { authenticate, hasPermission } from '../middleware/auth.js';

const router = Router();

/**
 * Permission Routes
 *
 * These routes handle all permission-related operations including:
 * - Retrieving permissions (all, by ID, by IDs)
 * - Assigning permissions to roles and users
 * - Removing permissions from roles
 * - Getting permissions for a specific role
 */

// PUBLIC ROUTES (for development/testing)
// ========================================

// // Get all permissions
// router.get('/', permissionController.getAllPermissions);

// // Get permission by ID
// router.get('/:id', permissionController.getPermissionById);

// // Get permissions by IDs
// router.post('/by-ids', permissionController.getPermissionsByIds);

// // Get permissions by category
// router.get('/category/:category', permissionController.getAllPermissions);

// // ROLE-PERMISSION ROUTES
// // ========================================

// // Get role permissions
// router.get('/role/:roleId', permissionController.getRolePermissions);

// // Assign single permission to role
// router.post('/role/assign', permissionController.assignPermissionsToRole);

// // Assign multiple permissions to role
// router.post('/role/assign-multiple', permissionController.assignMultiplePermissionsToRole);

// // Remove permission from role
// router.delete('/role/:roleId/permission/:permissionId', permissionController.removePermissionFromRole);

// USER-PERMISSION ROUTES
// ========================================

// Assign permissions to user
router.post('/user/assign', permissionController.assignPermissionsToUser);

// AUTHENTICATED ROUTES (for production)
// ========================================
// These routes are commented out for now to allow easier testing
// Uncomment and use these in production


// Get all permissions (authenticated)
router.get('/secure', authenticate, hasPermission(['permission:read']), permissionController.getAllPermissions);

// Get permission by ID (authenticated)
router.get('/secure/:id', authenticate, hasPermission(['permission:read']), permissionController.getPermissionById);

// Get permissions by IDs (authenticated)
router.post('/secure/by-ids', authenticate, hasPermission(['permission:read']), permissionController.getPermissionsByIds);

// Get role permissions (authenticated)
router.get('/secure/role/:roleId', authenticate, hasPermission(['permission:read', 'role:read']), permissionController.getRolePermissions);

// Assign permission to role (authenticated)
router.post('/secure/role/assign', authenticate, hasPermission(['permission:write', 'role:write']), permissionController.assignPermissionsToRole);

// Assign multiple permissions to role (authenticated)
router.post('/secure/role/assign-multiple', authenticate, hasPermission(['permission:write', 'role:write']), permissionController.assignMultiplePermissionsToRole);

// Remove permission from role (authenticated)
router.delete('/secure/role/:roleId/permission/:permissionId', authenticate, hasPermission(['permission:write', 'role:write']), permissionController.removePermissionFromRole);

// Assign permissions to user (authenticated)
router.post('/secure/user/assign', authenticate, hasPermission(['permission:write', 'user:write']), permissionController.assignPermissionsToUser);


export default router;
