import express from 'express'; // eslint-disable-line no-unused-vars
import {
  getAllMonitoringLogs,
  getMonitoringLogById,
  createMonitoringLog,
  updateMonitoringLog,
  deleteMonitoringLog,
} from '../controllers/monitoringLogController.js';

const router = express.Router();

router.get('/', getAllMonitoringLogs as any);
router.get('/:id', getMonitoringLogById as any);
router.post('/', createMonitoringLog as any);
router.put('/:id', updateMonitoringLog as any);
router.delete('/:id', deleteMonitoringLog as any);

export default router;
