const db = require('../db/mysql');

// GuestUser model
const GuestUser = {
  // Create table if it doesn't exist
  initTable: async () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS guest_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await db.query(sql);
      console.log('Guest Users table initialized');
    } catch (error) {
      console.error('Error initializing Guest Users table:', error);
      throw error;
    }
  },
  
  // Find all guest users
  findAll: async () => {
    const sql = 'SELECT * FROM guest_users ORDER BY created_at DESC';
    try {
      return await db.query(sql);
    } catch (error) {
      console.error('Error finding all guest users:', error);
      throw error;
    }
  },
  
  // Find guest user by ID
  findById: async (id) => {
    const sql = 'SELECT * FROM guest_users WHERE id = ?';
    try {
      const users = await db.query(sql, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding guest user by ID:', error);
      throw error;
    }
  },
  
  // Create a new guest user
  create: async (userData) => {
    const sql = 'INSERT INTO guest_users (full_name, email, phone) VALUES (?, ?, ?)';
    try {
      const result = await db.query(sql, [
        userData.fullName,
        userData.email || null,
        userData.phone
      ]);
      
      // Get the created user
      const user = await GuestUser.findById(result.insertId);
      return user;
    } catch (error) {
      console.error('Error creating guest user:', error);
      throw error;
    }
  },
  
  // Update last active timestamp
  updateLastActive: async (id) => {
    const sql = 'UPDATE guest_users SET last_active = CURRENT_TIMESTAMP WHERE id = ?';
    try {
      await db.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error updating guest user last active:', error);
      throw error;
    }
  }
};

module.exports = GuestUser;
