import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(requestLogger);

// Configure CORS with our flexible configuration
import corsOptions from './config/cors.js';
app.use(cors(corsOptions));

// Log all incoming requests
app.use((req, _res, next) => {
  logger.debug(`Incoming request: ${req.method} ${req.url}`, {
    origin: req.headers.origin,
    ip: req.ip
  });
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use(globalLimiter);

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'Backend API is running' });
});

// Import API routes
import userRoutes from './routes/userRoutes.js';
import userActivityRoutes from './routes/userActivityRoutes.js';
import promptTemplateRoutes from './routes/promptTemplateRoutes.js';
import aiCacheRoutes from './routes/aiCacheRoutes.js';
import aiModelConfigRoutes from './routes/aiModelConfigRoutes.js';
import authRoutes from './routes/authRoutes.js';
import followUpConfigRoutes from './routes/followUpConfigRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import widgetRoutes from './routes/widgetRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes.js';
import moderationRuleRoutes from './routes/moderationRuleRoutes.js';
import scrapingRoutes from './routes/scrapingRoutes.js';
import analyticsLogRoutes from './routes/analyticsLogRoutes.js';
import monitoringLogRoutes from './routes/monitoringLogRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/user-activities', userActivityRoutes);
app.use('/api/prompt-templates', promptTemplateRoutes);
app.use('/api/ai-cache', aiCacheRoutes);
app.use('/api/ai-model-configs', aiModelConfigRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/follow-up-configs', followUpConfigRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/moderation-rules', moderationRuleRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use('/api/analytics-logs', analyticsLogRoutes);
app.use('/api/monitoring-logs', monitoringLogRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 404
    }
  });
});

// Global error handler - must be the last middleware
app.use(errorHandler as ErrorRequestHandler);

export default app;
