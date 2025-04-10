export interface ChatSession {
  id: string;
  userId: string;
  status: string;
  contextRuleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
