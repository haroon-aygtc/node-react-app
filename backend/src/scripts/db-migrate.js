/**
 * Database migration script
 * This script creates all necessary tables in the database
 */

const db = require('../config/db');
const User = require('../models/User');
const AIModel = require('../models/AIModel');
const ChatSession = require('../models/ChatSession');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Test database connection
    console.log('Testing database connection...');
    await db.testConnection();
    console.log('Database connection successful.');
    
    // Create User table
    console.log('Creating User table...');
    await User.initTable();
    console.log('User table created/verified.');
    
    // Create AIModel table
    console.log('Creating AIModel table...');
    await AIModel.initTable();
    console.log('AIModel table created/verified.');
    
    // Create ChatSession table
    console.log('Creating ChatSession table...');
    await ChatSession.initTable();
    console.log('ChatSession table created/verified.');
    
    // Create default admin user if none exists
    console.log('Checking for admin user...');
    const adminExists = await checkAdminExists();
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      await createDefaultAdmin();
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
    
    console.log('Database migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

async function checkAdminExists() {
  try {
    const sql = 'SELECT * FROM users WHERE role = "admin" LIMIT 1';
    const results = await db.query(sql);
    return results.length > 0;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
}

async function createDefaultAdmin() {
  try {
    // Create a default admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the User.create method
      role: 'admin',
      user_type: 'registered'
    });
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
}

// Run the migrations
runMigrations();
