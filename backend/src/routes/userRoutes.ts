import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, hasPermission } from '../middleware/auth.js';

const router = Router();

// Public routes for development - should be secured in production
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);
// router.post('/', userController.createUser); // Add route for creating users
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

// // User role management routes - public for development
// router.get('/:id/roles', userController.getUserRoles);
// router.post('/:id/roles', userController.assignRolesToUser);
// router.post('/:id/roles/add', userController.addRoleToUser);
// router.post('/:id/roles/remove', userController.removeRoleFromUser);

// Authenticated routes for production (commented out for now)

// Protected routes - require authentication and specific permissions
router.get('/secure', authenticate, hasPermission(['user:read']), userController.getAllUsers);
router.get('/secure/:id', authenticate, hasPermission(['user:read']), userController.getUserById);
router.post('/secure', authenticate, hasPermission(['user:create']), userController.createUser);
router.put('/secure/:id', authenticate, hasPermission(['user:update']), userController.updateUser);
router.delete('/secure/:id', authenticate, hasPermission(['user:delete']), userController.deleteUser);

// User role management routes
router.get('/secure/:id/roles', authenticate, hasPermission(['user:read', 'role:read']), userController.getUserRoles);
router.post('/secure/:id/roles', authenticate, hasPermission(['user:update', 'role:assign']), userController.assignRolesToUser);
router.post('/secure/:id/roles/add', authenticate, hasPermission(['user:update', 'role:assign']), userController.addRoleToUser);
router.post('/secure/:id/roles/remove', authenticate, hasPermission(['user:update', 'role:assign']), userController.removeRoleFromUser);


export default router;
