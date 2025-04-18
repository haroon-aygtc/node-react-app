import express from 'express'; // eslint-disable-line no-unused-vars
import {
  getAllAnalyticsLogs,
  getAnalyticsLogById,
  createAnalyticsLog,
  updateAnalyticsLog,
  deleteAnalyticsLog,
} from '../controllers/analyticsLogController.js';

const router = express.Router();

router.get('/', getAllAnalyticsLogs as any);
router.get('/:id', getAnalyticsLogById as any);
router.post('/', createAnalyticsLog as any);
router.put('/:id', updateAnalyticsLog as any);
router.delete('/:id', deleteAnalyticsLog as any);

export default router;
