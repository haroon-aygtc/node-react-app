import prisma from '../config/prisma';
import type { PromptTemplate } from '../models/PromptTemplate';

export async function createPromptTemplate(data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromptTemplate> {
  return prisma.promptTemplate.create({ data }) as unknown as PromptTemplate;
}

export async function getAllPromptTemplates(): Promise<PromptTemplate[]> {
  return prisma.promptTemplate.findMany() as unknown as PromptTemplate[];
}

export async function getPromptTemplateById(id: string): Promise<PromptTemplate | null> {
  return prisma.promptTemplate.findUnique({ where: { id } }) as unknown as PromptTemplate | null;
}

export async function updatePromptTemplate(id: string, data: Partial<PromptTemplate>): Promise<PromptTemplate> {
  return prisma.promptTemplate.update({ where: { id }, data }) as unknown as PromptTemplate;
}

export async function deletePromptTemplate(id: string): Promise<void> {
  await prisma.promptTemplate.delete({ where: { id } });
}
