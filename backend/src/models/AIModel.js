const db = require('../config/db');
const { encryptApiKey, decryptApiKey, maskApiKey } = require('../utils/apiKeyUtils');

// AIModel model
const AIModel = {
  // Create table if it doesn't exist
  initTable: async () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS ai_models (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        provider ENUM('openai', 'anthropic', 'google', 'huggingface', 'azure', 'custom') DEFAULT 'openai',
        model_id VARCHAR(100) NOT NULL,
        api_key VARCHAR(255) NOT NULL,
        api_endpoint VARCHAR(255),
        max_tokens INT DEFAULT 2048,
        temperature DECIMAL(3,2) DEFAULT 0.7,
        is_active BOOLEAN DEFAULT FALSE,
        context_length INT DEFAULT 4096,
        cost_per_token DECIMAL(10,6) DEFAULT 0.0001,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      await db.query(sql);
      console.log('AI Models table initialized');
    } catch (error) {
      console.error('Error initializing AI Models table:', error);
      throw error;
    }
  },

  // Find all AI models
  findAll: async (includeApiKey = false) => {
    const fields = includeApiKey
      ? '*'
      : 'id, name, description, provider, model_id, api_endpoint, max_tokens, temperature, is_active, context_length, cost_per_token, created_at, updated_at';

    const sql = `SELECT ${fields} FROM ai_models`;
    try {
      return await db.query(sql);
    } catch (error) {
      console.error('Error finding all AI models:', error);
      throw error;
    }
  },

  // Find AI model by ID
  findById: async (id, includeApiKey = false) => {
    const fields = includeApiKey
      ? '*'
      : 'id, name, description, provider, model_id, api_endpoint, max_tokens, temperature, is_active, context_length, cost_per_token, created_at, updated_at';

    const sql = `SELECT ${fields} FROM ai_models WHERE id = ?`;
    try {
      const models = await db.query(sql, [id]);
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.error('Error finding AI model by ID:', error);
      throw error;
    }
  },

  // Create a new AI model
  create: async (modelData) => {
    const sql = `
      INSERT INTO ai_models
      (name, description, provider, model_id, api_key, api_endpoint, max_tokens, temperature, is_active, context_length, cost_per_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Encrypt the API key before storing
      const encryptedApiKey = encryptApiKey(modelData.apiKey);

      const result = await db.query(sql, [
        modelData.name,
        modelData.description,
        modelData.provider,
        modelData.modelId,
        encryptedApiKey,
        modelData.apiEndpoint || null,
        modelData.maxTokens || 2048,
        modelData.temperature || 0.7,
        modelData.isActive || false,
        modelData.contextLength || 4096,
        modelData.costPerToken || 0.0001
      ]);

      // Get the created model without API key
      const model = await AIModel.findById(result.insertId);
      return model;
    } catch (error) {
      console.error('Error creating AI model:', error);
      throw error;
    }
  },

  // Update an AI model
  update: async (id, modelData) => {
    // Check if API key is provided
    const hasApiKey = modelData.apiKey !== undefined;

    // Build the SQL query based on whether API key is provided
    let sql;
    let params;

    if (hasApiKey) {
      sql = `
        UPDATE ai_models
        SET name = ?, description = ?, provider = ?, model_id = ?, api_key = ?,
            api_endpoint = ?, max_tokens = ?, temperature = ?, is_active = ?,
            context_length = ?, cost_per_token = ?
        WHERE id = ?
      `;

      // Encrypt the API key before storing
      const encryptedApiKey = encryptApiKey(modelData.apiKey);

      params = [
        modelData.name,
        modelData.description,
        modelData.provider,
        modelData.modelId,
        encryptedApiKey,
        modelData.apiEndpoint || null,
        modelData.maxTokens || 2048,
        modelData.temperature || 0.7,
        modelData.isActive !== undefined ? modelData.isActive : false,
        modelData.contextLength || 4096,
        modelData.costPerToken || 0.0001,
        id
      ];
    } else {
      sql = `
        UPDATE ai_models
        SET name = ?, description = ?, provider = ?, model_id = ?,
            api_endpoint = ?, max_tokens = ?, temperature = ?, is_active = ?,
            context_length = ?, cost_per_token = ?
        WHERE id = ?
      `;
      params = [
        modelData.name,
        modelData.description,
        modelData.provider,
        modelData.modelId,
        modelData.apiEndpoint || null,
        modelData.maxTokens || 2048,
        modelData.temperature || 0.7,
        modelData.isActive !== undefined ? modelData.isActive : false,
        modelData.contextLength || 4096,
        modelData.costPerToken || 0.0001,
        id
      ];
    }

    try {
      await db.query(sql, params);

      // Get the updated model without API key
      const model = await AIModel.findById(id);
      return model;
    } catch (error) {
      console.error('Error updating AI model:', error);
      throw error;
    }
  },

  // Delete an AI model
  delete: async (id) => {
    const sql = 'DELETE FROM ai_models WHERE id = ?';
    try {
      await db.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting AI model:', error);
      throw error;
    }
  },

  // Toggle AI model active status
  toggleActive: async (id) => {
    const sql = 'UPDATE ai_models SET is_active = NOT is_active WHERE id = ?';
    try {
      await db.query(sql, [id]);

      // Get the updated model without API key
      const model = await AIModel.findById(id);
      return model;
    } catch (error) {
      console.error('Error toggling AI model active status:', error);
      throw error;
    }
  },

  // Find active AI model
  findActive: async () => {
    const sql = `
      SELECT id, name, description, provider, model_id, api_endpoint, max_tokens,
             temperature, is_active, context_length, cost_per_token, created_at, updated_at
      FROM ai_models
      WHERE is_active = TRUE
      LIMIT 1
    `;

    try {
      const models = await db.query(sql);
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.error('Error finding active AI model:', error);
      throw error;
    }
  },

  // Get the decrypted API key for a model (for use with AI providers)
  getDecryptedApiKey: async (id) => {
    const sql = 'SELECT api_key FROM ai_models WHERE id = ?';
    try {
      const models = await db.query(sql, [id]);
      if (models.length === 0) {
        throw new Error('AI model not found');
      }

      // Decrypt the API key
      return decryptApiKey(models[0].api_key);
    } catch (error) {
      console.error('Error getting decrypted API key:', error);
      throw error;
    }
  },

  // Get a masked version of the API key for display
  getMaskedApiKey: async (id) => {
    const sql = 'SELECT api_key FROM ai_models WHERE id = ?';
    try {
      const models = await db.query(sql, [id]);
      if (models.length === 0) {
        throw new Error('AI model not found');
      }

      // Decrypt and then mask the API key
      const decrypted = decryptApiKey(models[0].api_key);
      return maskApiKey(decrypted);
    } catch (error) {
      console.error('Error getting masked API key:', error);
      throw error;
    }
  }
};

module.exports = AIModel;
