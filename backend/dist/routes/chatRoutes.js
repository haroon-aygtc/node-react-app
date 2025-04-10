import { Router } from 'express';
import * as chatController from '../controllers/chatController';
const router = Router();
router.post('/start', chatController.startSession);
router.get('/session/:id', chatController.getSession);
router.get('/user/:userId', chatController.getUserSessions);
router.post('/message', chatController.addMessage);
router.get('/messages/:sessionId', chatController.getMessages);
export default router;
