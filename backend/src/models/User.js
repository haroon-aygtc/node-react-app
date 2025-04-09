const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// User model
const User = {
  // Create tables if they don't exist
  initTable: async () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role ENUM('user', 'admin', 'guest') DEFAULT 'user',
        user_type ENUM('registered', 'guest') DEFAULT 'registered',
        phone VARCHAR(20),
        profile_image VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      await db.query(sql);
      console.log('Users table initialized');
    } catch (error) {
      console.error('Error initializing users table:', error);
      throw error;
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
      const users = await db.query(sql, [email]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    try {
      const users = await db.query(sql, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Create a new registered user
  create: async (userData) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const sql = `
      INSERT INTO users (
        name, email, password, role, user_type, phone, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(sql, [
        userData.name,
        userData.email,
        hashedPassword,
        userData.role || 'user',
        'registered',
        userData.phone || null,
        userData.profileImage || null
      ]);

      // Get the created user
      const user = await User.findById(result.insertId);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Create a new guest user
  createGuest: async (userData) => {
    // Generate a random password for guest users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);

    const sql = `
      INSERT INTO users (
        name, email, password, role, user_type, phone
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(sql, [
        userData.fullName,
        userData.email || `guest_${Date.now()}@example.com`,
        hashedPassword,
        'guest',
        'guest',
        userData.phone || null
      ]);

      // Get the created guest user
      const user = await User.findById(result.insertId);
      return user;
    } catch (error) {
      console.error('Error creating guest user:', error);
      throw error;
    }
  },

  // Find all guest users
  findAllGuests: async () => {
    const sql = 'SELECT * FROM users WHERE user_type = "guest" ORDER BY created_at DESC';
    try {
      return await db.query(sql);
    } catch (error) {
      console.error('Error finding all guest users:', error);
      throw error;
    }
  },

  // Match password
  matchPassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // Generate JWT token
  getSignedJwtToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role, userType: user.user_type },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );
  },

  // Update last login time
  updateLastLogin: async (userId) => {
    const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
    try {
      await db.query(sql, [userId]);
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
};

module.exports = User;
