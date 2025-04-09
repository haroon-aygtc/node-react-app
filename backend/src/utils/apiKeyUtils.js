const crypto = require('crypto');
const config = require('../config/config');

// Encryption key and IV should be stored securely in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key_32_bytes_long'; // 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt an API key
 * @param {string} apiKey - The API key to encrypt
 * @returns {string} - The encrypted API key
 */
const encryptApiKey = (apiKey) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(apiKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Error encrypting API key:', error);
    // In production, return a more generic error
    throw new Error('Error processing API key');
  }
};

/**
 * Decrypt an API key
 * @param {string} encryptedApiKey - The encrypted API key
 * @returns {string} - The decrypted API key
 */
const decryptApiKey = (encryptedApiKey) => {
  try {
    const textParts = encryptedApiKey.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Error decrypting API key:', error);
    // In production, return a more generic error
    throw new Error('Error processing API key');
  }
};

/**
 * Mask an API key for display (e.g., sk-1234567890 -> sk-****7890)
 * @param {string} apiKey - The API key to mask
 * @returns {string} - The masked API key
 */
const maskApiKey = (apiKey) => {
  if (!apiKey) return '';
  
  // Handle different API key formats
  if (apiKey.startsWith('sk-')) {
    // OpenAI format: sk-1234567890abcdef
    return `${apiKey.substring(0, 3)}${'*'.repeat(apiKey.length - 7)}${apiKey.substring(apiKey.length - 4)}`;
  } else if (apiKey.startsWith('sk-ant-')) {
    // Anthropic format: sk-ant-1234567890abcdef
    return `${apiKey.substring(0, 7)}${'*'.repeat(apiKey.length - 11)}${apiKey.substring(apiKey.length - 4)}`;
  } else {
    // Generic format
    const visibleChars = Math.min(4, Math.floor(apiKey.length / 4));
    return `${'*'.repeat(apiKey.length - visibleChars)}${apiKey.substring(apiKey.length - visibleChars)}`;
  }
};

module.exports = {
  encryptApiKey,
  decryptApiKey,
  maskApiKey
};
