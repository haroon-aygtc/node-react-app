const express = require('express');
const { check } = require('express-validator');
const {
  getAIModels,
  getAIModel,
  createAIModel,
  updateAIModel,
  deleteAIModel,
  toggleActiveStatus,
  getActiveAIModel
} = require('../controllers/aiModelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/active', getActiveAIModel);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAIModels)
  .post([
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('provider', 'Provider is required').not().isEmpty(),
    check('modelId', 'Model ID is required').not().isEmpty(),
    check('apiKey', 'API key is required').not().isEmpty(),
    check('maxTokens', 'Max tokens must be a positive number').optional().isInt({ min: 1 }),
    check('temperature', 'Temperature must be between 0 and 2').optional().isFloat({ min: 0, max: 2 }),
    check('contextLength', 'Context length must be a positive number').optional().isInt({ min: 1 }),
    check('costPerToken', 'Cost per token must be a positive number').optional().isFloat({ min: 0 })
  ], createAIModel);

router.route('/:id')
  .get(getAIModel)
  .put([
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('provider', 'Provider is required').not().isEmpty(),
    check('modelId', 'Model ID is required').not().isEmpty(),
    check('maxTokens', 'Max tokens must be a positive number').optional().isInt({ min: 1 }),
    check('temperature', 'Temperature must be between 0 and 2').optional().isFloat({ min: 0, max: 2 }),
    check('contextLength', 'Context length must be a positive number').optional().isInt({ min: 1 }),
    check('costPerToken', 'Cost per token must be a positive number').optional().isFloat({ min: 0 })
  ], updateAIModel)
  .delete(deleteAIModel);

router.patch('/:id/toggle-active', toggleActiveStatus);

module.exports = router;
