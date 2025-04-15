import * as promptRepo from '../repositories/promptTemplateRepository.js';
import type { PromptTemplate } from '../models/index.js';

export async function createPromptTemplate(data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromptTemplate> {
  if (!data.name.trim()) throw new Error('Name is required');
  if (!data.templateText.trim()) throw new Error('Template text is required');
  return promptRepo.createPromptTemplate(data);
}

export async function getAllPromptTemplates(): Promise<PromptTemplate[]> {
  return promptRepo.getAllPromptTemplates();
}

export async function getPromptTemplateById(id: string): Promise<PromptTemplate | null> {
  return promptRepo.getPromptTemplateById(id);
}

export async function updatePromptTemplate(id: string, data: Partial<PromptTemplate>): Promise<PromptTemplate> {
  return promptRepo.updatePromptTemplate(id, data);
}

export async function deletePromptTemplate(id: string): Promise<void> {
  return promptRepo.deletePromptTemplate(id);
}
