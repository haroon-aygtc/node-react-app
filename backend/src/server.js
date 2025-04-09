const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/db');

// Import models
const User = require('./models/User');
const AIModel = require('./models/AIModel');
const ChatSession = require('./models/ChatSession');

// Import routes
const authRoutes = require('./routes/authRoutes');
const aiModelRoutes = require('./routes/aiModelRoutes');
const guestRoutes = require('./routes/guestRoutes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
// CORS configuration
const corsOptions = {
  // In development, allow all origins or use specific ones from env
  origin: config.nodeEnv === 'production'
    ? config.corsOrigins || 'https://yourdomain.com'
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/ai-models', aiModelRoutes);
app.use('/api/guest', guestRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    data: {
      apiVersion: '1.0.0'
    }
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    data: null
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong',
    data: null
  });
});

// Initialize database tables
const initDatabase = async () => {
  try {
    // Test database connection
    await db.testConnection();

    // Initialize tables
    await User.initTable();
    await AIModel.initTable();
    await ChatSession.initTable();

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);

  // Initialize database
  await initDatabase();
});
