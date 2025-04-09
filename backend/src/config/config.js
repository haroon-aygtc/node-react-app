require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tempolab',
    port: process.env.DB_PORT || 3306
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS || 'https://yourdomain.com'
};
