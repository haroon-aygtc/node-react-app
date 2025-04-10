import prisma from '../config/prisma';
import type { AIModelConfig } from '../models/AIModelConfig';

export async function createAIModelConfig(data: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIModelConfig> {
  return prisma.apiKey.create({ data }) as unknown as AIModelConfig;
}

export async function getAllAIModelConfigs(): Promise<AIModelConfig[]> {
  return prisma.apiKey.findMany() as unknown as AIModelConfig[];
}

export async function getAIModelConfigById(id: string): Promise<AIModelConfig | null> {
  return prisma.apiKey.findUnique({ where: { id } }) as unknown as AIModelConfig | null;
}

export async function updateAIModelConfig(id: string, data: Partial<AIModelConfig>): Promise<AIModelConfig> {
  return prisma.apiKey.update({ where: { id }, data }) as unknown as AIModelConfig;
}

export async function deleteAIModelConfig(id: string): Promise<void> {
  await prisma.apiKey.delete({ where: { id } });
}
