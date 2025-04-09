export type MessageStatus = "sending" | "sent" | "error";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  status?: MessageStatus;
  followUpQuestions?: FollowUpQuestion[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WebSocketMessage {
  type:
    | "message"
    | "typing"
    | "read"
    | "error"
    | "connection"
    | "history"
    | "history_request";
  payload: any;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface AnswerOption {
  id: string;
  text: string;
  response: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  answerOptions: AnswerOption[];
}

export interface ResponseFormat {
  id: string;
  name: string;
  description: string;
  template: string;
  followUpQuestions?: FollowUpQuestion[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  modelId: string;
  apiKey: string;
  apiEndpoint?: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
  contextLength: number;
  costPerToken: number;
  createdAt?: Date;
  updatedAt?: Date;
}
