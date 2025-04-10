import prisma from '../config/prisma';
import type { ChatSession } from '../models/ChatSession';
import type { ChatMessage } from '../models/ChatMessage';

export async function createSession(data: {
  userId: string;
  contextRuleId?: string | null;
}): Promise<ChatSession> {
  return prisma.chatSession.create({ data }) as unknown as ChatSession;
}

export async function getSessionById(id: string): Promise<ChatSession | null> {
  return prisma.chatSession.findUnique({ where: { id } }) as unknown as ChatSession | null;
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  return prisma.chatSession.findMany({ where: { userId } }) as unknown as ChatSession[];
}

export async function createMessage(data: {
  sessionId: string;
  sender: string;
  content: string;
  modelUsed?: string;
  metadata?: Record<string, any>;
}): Promise<ChatMessage> {
  return prisma.chatMessage.create({ data }) as unknown as ChatMessage;
}

export async function getMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
  return prisma.chatMessage.findMany({ where: { sessionId } }) as unknown as ChatMessage[];
}
