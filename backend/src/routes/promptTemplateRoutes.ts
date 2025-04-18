import { Router } from 'express';
import * as promptController from '../controllers/promptTemplateController.js';

const router = Router();

router.post('/', promptController.createPromptTemplate as any);
router.get('/', promptController.getAllPromptTemplates as any);
router.get('/:id', promptController.getPromptTemplateById as any);
router.put('/:id', promptController.updatePromptTemplate as any);
router.delete('/:id', promptController.deletePromptTemplate as any);

export default router;
