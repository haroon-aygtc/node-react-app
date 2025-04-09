const AIModel = require('../models/AIModel');
const { validationResult } = require('express-validator');
const { success, error, validationError } = require('../utils/responseHandler');

// @desc    Get all AI models
// @route   GET /api/ai-models
// @access  Private/Admin
exports.getAIModels = async (req, res) => {
  try {
    const aiModels = await AIModel.findAll();

    return success(
      res,
      'AI models retrieved successfully',
      { aiModels }
    );
  } catch (err) {
    console.error('Get AI models error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get single AI model
// @route   GET /api/ai-models/:id
// @access  Private/Admin
exports.getAIModel = async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return error(res, 'AI model not found', 404);
    }

    return success(
      res,
      'AI model retrieved successfully',
      { aiModel }
    );
  } catch (err) {
    console.error('Get AI model error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Create AI model
// @route   POST /api/ai-models
// @access  Private/Admin
exports.createAIModel = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const {
      name,
      description,
      provider,
      modelId,
      apiKey,
      apiEndpoint,
      maxTokens,
      temperature,
      isActive,
      contextLength,
      costPerToken
    } = req.body;

    // Create AI model
    const aiModel = await AIModel.create({
      name,
      description,
      provider,
      modelId,
      apiKey,
      apiEndpoint,
      maxTokens,
      temperature,
      isActive,
      contextLength,
      costPerToken
    });

    // API key is already excluded by the model

    return success(
      res,
      'AI model created successfully',
      { aiModel },
      201
    );
  } catch (err) {
    console.error('Create AI model error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Update AI model
// @route   PUT /api/ai-models/:id
// @access  Private/Admin
exports.updateAIModel = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const {
      name,
      description,
      provider,
      modelId,
      apiKey,
      apiEndpoint,
      maxTokens,
      temperature,
      isActive,
      contextLength,
      costPerToken
    } = req.body;

    // Find AI model
    let aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return error(res, 'AI model not found', 404);
    }

    // Update fields
    const updateData = {
      name,
      description,
      provider,
      modelId,
      apiEndpoint,
      maxTokens,
      temperature,
      isActive,
      contextLength,
      costPerToken,
      updatedAt: Date.now()
    };

    // Only update API key if provided
    if (apiKey) {
      updateData.apiKey = apiKey;
    }

    // Update AI model
    aiModel = await AIModel.update(req.params.id, updateData);

    return success(
      res,
      'AI model updated successfully',
      { aiModel }
    );
  } catch (err) {
    console.error('Update AI model error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Delete AI model
// @route   DELETE /api/ai-models/:id
// @access  Private/Admin
exports.deleteAIModel = async (req, res) => {
  try {
    // Find AI model
    const aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return error(res, 'AI model not found', 404);
    }

    // Delete AI model
    await AIModel.delete(req.params.id);

    return success(
      res,
      'AI model deleted successfully',
      null
    );
  } catch (err) {
    console.error('Delete AI model error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Toggle AI model active status
// @route   PATCH /api/ai-models/:id/toggle-active
// @access  Private/Admin
exports.toggleActiveStatus = async (req, res) => {
  try {
    // Find AI model
    const aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return error(res, 'AI model not found', 404);
    }

    // Toggle active status
    const updatedModel = await AIModel.toggleActive(req.params.id);

    return success(
      res,
      `AI model ${updatedModel.is_active ? 'activated' : 'deactivated'} successfully`,
      { aiModel: updatedModel }
    );
  } catch (err) {
    console.error('Toggle AI model status error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get active AI model
// @route   GET /api/ai-models/active
// @access  Public
exports.getActiveAIModel = async (req, res) => {
  try {
    const aiModel = await AIModel.findActive();

    if (!aiModel) {
      return error(res, 'No active AI model found', 404);
    }

    return success(
      res,
      'Active AI model retrieved successfully',
      { aiModel }
    );
  } catch (err) {
    console.error('Get active AI model error:', err);
    return error(res, 'Server error', 500);
  }
};
