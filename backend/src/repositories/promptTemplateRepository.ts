import prisma from '../config/prisma.js';
import type { PromptTemplate } from '../models/index.js';

export async function createPromptTemplate(data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromptTemplate> {
  return prisma.promptTemplate.create({ data });
}

export async function getAllPromptTemplates(): Promise<PromptTemplate[]> {
  return prisma.promptTemplate.findMany();
}

export async function getPromptTemplateById(id: string): Promise<PromptTemplate | null> {
  return prisma.promptTemplate.findUnique({ where: { id } });
}

export async function updatePromptTemplate(id: string, data: Partial<PromptTemplate>): Promise<PromptTemplate> {
  return prisma.promptTemplate.update({ where: { id }, data });
}

export async function deletePromptTemplate(id: string): Promise<void> {
  await prisma.promptTemplate.delete({ where: { id } });
}
