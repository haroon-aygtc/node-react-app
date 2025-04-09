const mysql = require('mysql2/promise');
const config = require('../config/config');

// Create a connection pool
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error);
    return false;
  }
};

// Execute a query
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
