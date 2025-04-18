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
  MonitoringLog as PrismaMonitoringLog,
  UserRole as PrismaUserRole,
  RolePermission as PrismaRolePermission,
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';

// Re-export Prisma types directly
export interface User extends Omit<PrismaUser, 'userRoles'> {
  userRoles: UserRole[];
}
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

export interface Guest {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Role type based on schema.prisma
export interface Role {
  id: number;
  name: string;
  description?: string | null;
  isDefault: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  rolePermissions?: RolePermission[];
}

// Define UserRole type based on schema.prisma
export interface UserRole {
  userId: number;
  roleId: number;
  assignedAt: Date;
  assignedBy: number | null;
  createdAt: Date;
  role?: Role;
}

// Define Permission type based on schema.prisma
export interface Permission {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
  rolePermissions?: RolePermission[];
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
  assignedAt: Date;
  assignedBy: number | null;
  createdAt: Date;
  role?: Role;
  permission?: Permission;
}
