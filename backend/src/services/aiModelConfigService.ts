import * as aiRepo from '../repositories/aiModelConfigRepository.js';
import type { AIModelConfig } from '../models/index.js';

export async function createAIModelConfig(data: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIModelConfig> {
  if (!data.name.trim()) throw new Error('Name is required');
  if (!data.provider.trim()) throw new Error('Provider is required');
  if (!data.apiKey.trim()) throw new Error('API key is required');
  return aiRepo.createAIModelConfig(data);
}

export async function getAllAIModelConfigs(): Promise<AIModelConfig[]> {
  return aiRepo.getAllAIModelConfigs();
}

export async function getAIModelConfigById(id: string): Promise<AIModelConfig | null> {
  return aiRepo.getAIModelConfigById(id);
}

export async function updateAIModelConfig(id: string, data: Partial<AIModelConfig>): Promise<AIModelConfig> {
  return aiRepo.updateAIModelConfig(id, data);
}

export async function deleteAIModelConfig(id: string): Promise<void> {
  return aiRepo.deleteAIModelConfig(id);
}
