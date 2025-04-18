import { Router } from 'express';
import * as roleController from '../controllers/roleController.js';
import { authenticate, hasPermission } from '../middleware/auth.js';

const router = Router();

// Role routes - Public for development
// router.get('/', roleController.getAllRoles);
// router.get('/:id', roleController.getRoleById);
// router.post('/', roleController.createRole);
// router.put('/:id', roleController.updateRole);
// router.delete('/:id', roleController.deleteRole);

// // Permission routes - Public for development
// router.get('/permissions/all', roleController.getAllPermissions);
// router.get('/permissions/:id', roleController.getPermissionById);
// router.post('/permissions/assign', roleController.assignPermissions);

// // User routes - Public for development
// router.get('/:id/users', roleController.getUsersByRoleId);
// router.post('/:id/users', roleController.assignRoleToUser);
// router.post('/:id/users/remove', roleController.removeRoleFromUser);

// Authenticated routes for production (commented out for now)

// Role routes
router.get('/secure', authenticate, hasPermission(['role:read']), roleController.getAllRoles);
router.get('/secure/:id', authenticate, hasPermission(['role:read']), roleController.getRoleById);
router.post('/secure', authenticate, hasPermission(['role:create']), roleController.createRole);
router.put('/secure/:id', authenticate, hasPermission(['role:update']), roleController.updateRole);
router.delete('/secure/:id', authenticate, hasPermission(['role:delete']), roleController.deleteRole);

// Permission routes
router.get('/secure/permissions/all', authenticate, hasPermission(['permission:read']), roleController.getAllPermissions);
router.get('/secure/permissions/:id', authenticate, hasPermission(['permission:read']), roleController.getPermissionById);
router.post('/secure/permissions/assign', authenticate, hasPermission(['permission:assign']), roleController.assignPermissions);

// User routes
router.get('/secure/:id/users', authenticate, hasPermission(['role:read', 'user:read']), roleController.getUsersByRoleId);
router.post('/secure/:id/users', authenticate, hasPermission(['role:assign', 'user:update']), roleController.assignRoleToUser);
router.post('/secure/:id/users/remove', authenticate, hasPermission(['role:assign', 'user:update']), roleController.removeRoleFromUser);


export default router;
