// src/lib/types/api.types.ts
// API-specific type definitions

import type { 
  Prompt, 
  PromptCategory,
  User 
} from './database.types';

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  statusCode?: number;
  message?: string;
}

/**
 * Paginated API response format
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Request payload for creating/updating a prompt
 */
export interface PromptApiRequest {
  id?: string;
  title: string;
  description?: string | null;
  content: string;
  category: PromptCategory;
  // tags: string[];
  isPublic: boolean;
  // variables?: PromptVariable[];
  authorName?: string | null;
  authorId?: string | null;
}

/**
 * Extended prompt response with additional metadata
 */
export interface PromptApiResponse extends Omit<Prompt, 'author'> {
  author?: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
  voteCount?: number;
  commentCount?: number;
  hasVoted?: boolean;
  isOwner?: boolean;
}

/**
 * Error response format
 */
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  token: string;
  expires: Date;
}