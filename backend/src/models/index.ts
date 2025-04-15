/**
 * Model type definitions
 * 
 * This file re-exports Prisma's generated types with any necessary extensions
 * or customizations. In most cases, we can use Prisma's types directly.
 */

import { 
  User as PrismaUser,
  UserActivity as PrismaUserActivity,
  FollowUpConfig as PrismaFollowUpConfig,
  PredefinedQuestionSet as PrismaPredefinedQuestionSet,
  TopicBasedQuestionSet as PrismaTopicBasedQuestionSet,
  PromptTemplate as PrismaPromptTemplate,
  AICache as PrismaAICache,
  ChatSession as PrismaChatSession,
  ChatMessage as PrismaChatMessage,
  WidgetConfig as PrismaWidgetConfig,
  ApiKey as PrismaApiKey,
  KnowledgeBaseEntry as PrismaKnowledgeBaseEntry,
  ModerationRule as PrismaModerationRule,
  ScrapingJob as PrismaScrapingJob,
  ResponseFormattingConfig as PrismaResponseFormattingConfig,
  ScrapingSelector as PrismaScrapingSelector,
  ScrapingData as PrismaScrapingData,
  AnalyticsLog as PrismaAnalyticsLog,
  MonitoringLog as PrismaMonitoringLog
} from '@prisma/client';

// Re-export Prisma types directly
export type User = PrismaUser;
export type UserActivity = PrismaUserActivity;
export type FollowUpConfig = PrismaFollowUpConfig;
export type PredefinedQuestionSet = PrismaPredefinedQuestionSet;
export type TopicBasedQuestionSet = PrismaTopicBasedQuestionSet;
export type PromptTemplate = PrismaPromptTemplate;
export type AICache = PrismaAICache;
export type ChatSession = PrismaChatSession;
export type ChatMessage = PrismaChatMessage;
export type WidgetConfig = PrismaWidgetConfig;
export type ApiKey = PrismaApiKey;
export type KnowledgeBaseEntry = PrismaKnowledgeBaseEntry;
export type ModerationRule = PrismaModerationRule;
export type ScrapingJob = PrismaScrapingJob;
export type ResponseFormattingConfig = PrismaResponseFormattingConfig;
export type ScrapingSelector = PrismaScrapingSelector;
export type ScrapingData = PrismaScrapingData;
export type AnalyticsLog = PrismaAnalyticsLog;
export type MonitoringLog = PrismaMonitoringLog;

// Add any custom types that don't directly map to Prisma models
export type AIModelConfig = ApiKey; // AIModelConfig is actually stored in the ApiKey table

// Add Guest type which seems to be referenced but not in the Prisma schema
export interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
