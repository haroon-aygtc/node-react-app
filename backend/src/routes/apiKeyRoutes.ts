import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllApiKeys,
  getApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} from '../controllers/apiKeyController';

const router = express.Router();

// All API key routes require authentication
router.get('/', authenticate, getAllApiKeys);
router.get('/:id', authenticate, getApiKeyById);
router.post('/', authenticate, createApiKey);
router.put('/:id', authenticate, updateApiKey);
router.delete('/:id', authenticate, deleteApiKey);

export default router;
