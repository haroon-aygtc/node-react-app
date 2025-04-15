import prisma from '../config/prisma.js';
import type { AIModelConfig } from '../models/index.js';

export async function createAIModelConfig(data: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIModelConfig> {
  return prisma.apiKey.create({ data });
}

export async function getAllAIModelConfigs(): Promise<AIModelConfig[]> {
  return prisma.apiKey.findMany();
}

export async function getAIModelConfigById(id: string): Promise<AIModelConfig | null> {
  return prisma.apiKey.findUnique({ where: { id } });
}

export async function updateAIModelConfig(id: string, data: Partial<AIModelConfig>): Promise<AIModelConfig> {
  return prisma.apiKey.update({ where: { id }, data });
}

export async function deleteAIModelConfig(id: string): Promise<void> {
  await prisma.apiKey.delete({ where: { id } });
}
