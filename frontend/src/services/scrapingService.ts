import api from './api';
import type { ScrapingConfig, SelectorGroup, ScrapingResult } from '@/types/scraping';

// Create scraping config
export async function createScrapingConfig(data: Omit<ScrapingConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScrapingConfig> {
  const response = await api.post('/scraping/configs', data, true);
  return response.data.config;
}

// Get all scraping configs
export async function getScrapingConfigs(): Promise<ScrapingConfig[]> {
  const response = await api.get('/scraping/configs', true);
  return response.data.configs;
}

// Create selector group
export async function createSelectorGroup(data: Omit<SelectorGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<SelectorGroup> {
  const response = await api.post('/scraping/selectors', data, true);
  return response.data.selectorGroup;
}

// Get all selector groups
export async function getSelectorGroups(): Promise<SelectorGroup[]> {
  const response = await api.get('/scraping/selectors', true);
  return response.data.selectorGroups;
}

// Start scraping job
export async function startScrapingJob(configId: string): Promise<ScrapingResult> {
  const response = await api.post(`/scraping/jobs`, { configId }, true);
  return response.data.result;
}

// Get scraping job result
export async function getScrapingResult(jobId: string): Promise<ScrapingResult> {
  const response = await api.get(`/scraping/jobs/${jobId}`, true);
  return response.data.result;
}
