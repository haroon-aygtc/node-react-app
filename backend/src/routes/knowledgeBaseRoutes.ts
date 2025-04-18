import express from 'express'; // eslint-disable-line no-unused-vars
import {
  getAllKnowledgeBaseEntries,
  getKnowledgeBaseEntryById,
  createKnowledgeBaseEntry,
  updateKnowledgeBaseEntry,
  deleteKnowledgeBaseEntry,
} from '../controllers/knowledgeBaseController.js';

const router = express.Router();

router.get('/', getAllKnowledgeBaseEntries as any);
router.get('/:id', getKnowledgeBaseEntryById as any);
router.post('/', createKnowledgeBaseEntry as any);
router.put('/:id', updateKnowledgeBaseEntry as any);
router.delete('/:id', deleteKnowledgeBaseEntry as any);

export default router;
