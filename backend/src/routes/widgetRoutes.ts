import express from 'express';
import {
  getAllWidgets,
  getWidgetById,
  createWidget,
  updateWidget,
  deleteWidget,
} from '../controllers/widgetController.js';

const router = express.Router();

router.get('/', getAllWidgets as any);
router.get('/:id', getWidgetById as any);
router.post('/', createWidget as any);
router.put('/:id', updateWidget as any);
router.delete('/:id', deleteWidget as any);

export default router;
