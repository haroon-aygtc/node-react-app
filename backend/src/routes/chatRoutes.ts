import { Router } from 'express';
import * as chatController from '../controllers/chatController.js';

const router = Router();

router.post('/start', chatController.startSession as any);
router.get('/session/:id', chatController.getSession as any);
router.get('/user/:userId', chatController.getUserSessions as any);
router.post('/message', chatController.addMessage as any);
router.get('/messages/:sessionId', chatController.getMessages as any);

export default router;
