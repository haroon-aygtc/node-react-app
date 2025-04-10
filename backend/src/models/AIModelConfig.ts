export interface AIModelConfig {
  id: string;
  userId: string;
  name: string;
  provider: string;
  apiKey: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
