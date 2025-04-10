export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: string;
  content: string;
  modelUsed?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
}
