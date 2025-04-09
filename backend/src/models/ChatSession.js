const db = require('../config/db');

// ChatSession model
const ChatSession = {
  // Create tables if they don't exist
  initTable: async () => {
    // Create chat_sessions table
    const sessionsSql = `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_user_id INT,
        user_id INT,
        ai_model_id INT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (guest_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (ai_model_id) REFERENCES ai_models(id) ON DELETE SET NULL
      )
    `;

    // Create chat_messages table
    const messagesSql = `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        content TEXT NOT NULL,
        sender ENUM('user', 'assistant') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
      )
    `;

    try {
      await db.query(sessionsSql);
      await db.query(messagesSql);
      console.log('Chat Sessions and Messages tables initialized');
    } catch (error) {
      console.error('Error initializing Chat tables:', error);
      throw error;
    }
  },

  // Create a new chat session
  create: async (sessionData) => {
    const sql = 'INSERT INTO chat_sessions (guest_user_id, user_id, ai_model_id, is_active) VALUES (?, ?, ?, ?)';
    try {
      const result = await db.query(sql, [
        sessionData.guestUserId || null,
        sessionData.userId || null,
        sessionData.aiModelId || null,
        sessionData.isActive !== undefined ? sessionData.isActive : true
      ]);

      return { id: result.insertId, ...sessionData };
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },

  // Find chat session by ID
  findById: async (id) => {
    const sql = 'SELECT * FROM chat_sessions WHERE id = ?';
    try {
      const sessions = await db.query(sql, [id]);
      return sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      console.error('Error finding chat session by ID:', error);
      throw error;
    }
  },

  // Add message to chat session
  addMessage: async (sessionId, message) => {
    const sql = 'INSERT INTO chat_messages (session_id, content, sender) VALUES (?, ?, ?)';
    try {
      const result = await db.query(sql, [
        sessionId,
        message.content,
        message.sender
      ]);

      // Get the created message
      const messageSql = 'SELECT * FROM chat_messages WHERE id = ?';
      const messages = await db.query(messageSql, [result.insertId]);
      return messages.length > 0 ? messages[0] : null;
    } catch (error) {
      console.error('Error adding message to chat session:', error);
      throw error;
    }
  },

  // Get messages for a chat session
  getMessages: async (sessionId) => {
    const sql = 'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC';
    try {
      return await db.query(sql, [sessionId]);
    } catch (error) {
      console.error('Error getting chat session messages:', error);
      throw error;
    }
  },

  // End a chat session
  endSession: async (id) => {
    const sql = 'UPDATE chat_sessions SET is_active = FALSE, ended_at = CURRENT_TIMESTAMP WHERE id = ?';
    try {
      await db.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  },

  // Get sessions for a guest user
  getSessionsByGuestId: async (guestUserId) => {
    const sql = 'SELECT * FROM chat_sessions WHERE guest_user_id = ? ORDER BY started_at DESC';
    try {
      return await db.query(sql, [guestUserId]);
    } catch (error) {
      console.error('Error getting guest user chat sessions:', error);
      throw error;
    }
  },

  // Get sessions for a registered user
  getSessionsByUserId: async (userId) => {
    const sql = 'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY started_at DESC';
    try {
      return await db.query(sql, [userId]);
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      throw error;
    }
  }
};

module.exports = ChatSession;
