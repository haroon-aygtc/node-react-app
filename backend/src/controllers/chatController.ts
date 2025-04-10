import { Request, Response } from 'express';
import * as chatService from '../services/chatService';

export async function startSession(req: Request, res: Response) {
  try {
    const { userId, contextRuleId } = req.body;
    const session = await chatService.startSession(userId, contextRuleId);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const session = await chatService.getSessionById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
}

export async function getUserSessions(req: Request, res: Response) {
  try {
    const sessions = await chatService.getUserSessions(req.params.userId);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}

export async function addMessage(req: Request, res: Response) {
  try {
    const message = await chatService.addMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const messages = await chatService.getMessagesBySession(req.params.sessionId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}
