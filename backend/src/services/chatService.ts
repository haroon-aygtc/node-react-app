import * as chatRepo from '../repositories/chatRepository';
import type { ChatSession } from '../models/ChatSession';
import type { ChatMessage } from '../models/ChatMessage';

export async function startSession(userId: string, contextRuleId?: string | null): Promise<ChatSession> {
  return chatRepo.createSession({ userId, contextRuleId });
}

export async function getSessionById(id: string): Promise<ChatSession | null> {
  return chatRepo.getSessionById(id);
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  return chatRepo.getUserSessions(userId);
}

export async function addMessage(data: {
  sessionId: string;
  sender: string;
  content: string;
  modelUsed?: string;
  metadata?: Record<string, any>;
}): Promise<ChatMessage> {
  if (!data.content.trim()) throw new Error('Message content is required');
  return chatRepo.createMessage(data);
}

export async function getMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
  return chatRepo.getMessagesBySession(sessionId);
}
