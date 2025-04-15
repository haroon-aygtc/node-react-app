import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/:id', userController.getUserById);

// Protected routes - require authentication
router.get('/', authenticate, userController.getAllUsers);
router.put('/:id', authenticate, userController.updateUser);

// Admin-only routes
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

export default router;
