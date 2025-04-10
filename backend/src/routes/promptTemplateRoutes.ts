import { Router } from 'express';
import * as promptController from '../controllers/promptTemplateController';

const router = Router();

router.post('/', promptController.createPromptTemplate);
router.get('/', promptController.getAllPromptTemplates);
router.get('/:id', promptController.getPromptTemplateById);
router.put('/:id', promptController.updatePromptTemplate);
router.delete('/:id', promptController.deletePromptTemplate);

export default router;
