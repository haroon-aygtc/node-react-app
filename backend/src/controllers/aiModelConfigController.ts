import { Request, Response } from 'express';
import * as aiService from '../services/aiModelConfigService';

export async function createAIModelConfig(req: Request, res: Response) {
  try {
    const config = await aiService.createAIModelConfig(req.body);
    res.status(201).json(config);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getAllAIModelConfigs(req: Request, res: Response) {
  try {
    const configs = await aiService.getAllAIModelConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI model configs' });
  }
}

export async function getAIModelConfigById(req: Request, res: Response) {
  try {
    const config = await aiService.getAIModelConfigById(req.params.id);
    if (!config) return res.status(404).json({ error: 'AI model config not found' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI model config' });
  }
}

export async function updateAIModelConfig(req: Request, res: Response) {
  try {
    const config = await aiService.updateAIModelConfig(req.params.id, req.body);
    res.json(config);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteAIModelConfig(req: Request, res: Response) {
  try {
    await aiService.deleteAIModelConfig(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete AI model config' });
  }
}
