import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'Backend API is running' });
});
// TODO: Import and use API routes here
import userRoutesNew from './routes/userRoutes.js';
import userActivityRoutes from './routes/userActivityRoutes.js';
import promptTemplateRoutesNew from './routes/promptTemplateRoutes.js';
import aiCacheRoutes from './routes/aiCacheRoutes.js';
import aiModelConfigRoutes from './routes/aiModelConfigRoutes.js';
import followUpConfigRoutes from './routes/followUpConfigRoutes.js';
import chatRoutesOld from './routes/chatRoutes.js';
import chatRoutesNew from './routes/chatRoutes.js';
import widgetRoutes from './routes/widgetRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes.js';
import moderationRuleRoutes from './routes/moderationRuleRoutes.js';
import scrapingRoutes from './routes/scrapingRoutes.js';
import analyticsLogRoutes from './routes/analyticsLogRoutes.js';
import monitoringLogRoutes from './routes/monitoringLogRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import authRoutesNew from './routes/authRoutes.js';
app.use('/api/users', userRoutesNew);
app.use('/api/user-activities', userActivityRoutes);
app.use('/api/prompt-templates', promptTemplateRoutesNew);
app.use('/api/ai-cache', aiCacheRoutes);
app.use('/api/ai-model-configs', aiModelConfigRoutes);
app.use('/api/auth', authRoutesNew);
app.use('/api/follow-up-configs', followUpConfigRoutes);
app.use('/api/chat-sessions', chatRoutesOld);
app.use('/api/chat', chatRoutesNew);
app.use('/api/widgets', widgetRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/moderation-rules', moderationRuleRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use('/api/analytics-logs', analyticsLogRoutes);
app.use('/api/monitoring-logs', monitoringLogRoutes);
app.use('/api/guests', guestRoutes);
export default app;
