import express from 'express'; // eslint-disable-line no-unused-vars
import { authenticate } from '../middleware/auth.js';
import {
  getAllApiKeys,
  getApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from '../controllers/apiKeyController.js';

const router = express.Router();

// All API key routes require authentication
router.get('/', authenticate, getAllApiKeys as any);
router.get('/:id', authenticate, getApiKeyById as any);
router.post('/', authenticate, createApiKey as any);
router.put('/:id', authenticate, updateApiKey as any);
router.delete('/:id', authenticate, deleteApiKey as any);

export default router;
