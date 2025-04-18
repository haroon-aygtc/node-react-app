import express from 'express'; // eslint-disable-line no-unused-vars
import {
  getAllModerationRules,
  getModerationRuleById,
  createModerationRule,
  updateModerationRule,
  deleteModerationRule,
} from '../controllers/moderationRuleController.js';

const router = express.Router();

router.get('/', getAllModerationRules as any);
router.get('/:id', getModerationRuleById as any);
router.post('/', createModerationRule as any);
router.put('/:id', updateModerationRule as any);
router.delete('/:id', deleteModerationRule as any);

export default router;
