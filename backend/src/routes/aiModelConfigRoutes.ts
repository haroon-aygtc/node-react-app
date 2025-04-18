import { Router } from 'express';
import * as aiController from '../controllers/aiModelConfigController.js';

const router = Router();

router.post('/', aiController.createAIModelConfig as any);
router.get('/', aiController.getAllAIModelConfigs as any);
router.get('/:id', aiController.getAIModelConfigById as any);
router.put('/:id', aiController.updateAIModelConfig as any);
router.delete('/:id', aiController.deleteAIModelConfig as any);

export default router;
