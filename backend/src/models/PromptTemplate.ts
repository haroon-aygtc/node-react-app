export interface PromptTemplate {
  id: string;
  name: string;
  description?: string | null;
  templateText: string;
  variables: Record<string, any>;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
