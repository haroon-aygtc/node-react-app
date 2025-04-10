import { Router } from 'express';
import * as aiController from '../controllers/aiModelConfigController';

const router = Router();

router.post('/', aiController.createAIModelConfig);
router.get('/', aiController.getAllAIModelConfigs);
router.get('/:id', aiController.getAIModelConfigById);
router.put('/:id', aiController.updateAIModelConfig);
router.delete('/:id', aiController.deleteAIModelConfig);

export default router;
