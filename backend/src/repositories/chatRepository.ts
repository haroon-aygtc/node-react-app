import prisma from '../config/prisma.js';
import type { ChatSession, ChatMessage } from '../models/index.js';

export async function createSession(data: {
  userId: string;
  contextRuleId?: string | null;
}): Promise<ChatSession> {
  return prisma.chatSession.create({ data });
}

export async function getSessionById(id: string): Promise<ChatSession | null> {
  return prisma.chatSession.findUnique({ where: { id } });
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  return prisma.chatSession.findMany({ where: { userId } });
}

export async function createMessage(data: {
  sessionId: string;
  sender: string;
  content: string;
  modelUsed?: string;
  metadata?: Record<string, any>;
}): Promise<ChatMessage> {
  return prisma.chatMessage.create({ data });
}

export async function getMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
  return prisma.chatMessage.findMany({ where: { sessionId } });
}
