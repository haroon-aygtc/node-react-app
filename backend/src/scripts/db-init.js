/**
 * Database initialization script
 * This script creates the database if it doesn't exist
 */

const mysql = require('mysql2/promise');
const config = require('../config/config');

async function initializeDatabase() {
  // Create a connection without specifying a database
  const connection = await mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port
  });

  try {
    console.log(`Checking if database '${config.database.database}' exists...`);
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [config.database.database]
    );

    if (rows.length === 0) {
      console.log(`Database '${config.database.database}' does not exist. Creating...`);
      
      // Create the database
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database.database}\``);
      console.log(`Database '${config.database.database}' created successfully.`);
    } else {
      console.log(`Database '${config.database.database}' already exists.`);
    }

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run the initialization
initializeDatabase();
