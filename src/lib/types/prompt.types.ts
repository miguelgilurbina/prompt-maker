// src/lib/types/prompt.types.ts
// Feature-specific prompt types that extend or compose base types from database.types.ts
// These types are used for specific UI features and API interactions

import type { 
  PromptVariable as DBPromptVariable, 
  PromptCategory as DBPromptCategory,
  User
} from './index';

export type PromptVariable = DBPromptVariable;
export type PromptCategory = DBPromptCategory;

// Note: ApiResponse and PaginatedResponse are exported from index.ts to avoid conflicts
/**
 * Type for prompt form data used in create/edit forms
 */
export interface PromptFormData {
  id?: string;
  title: string;
  description: string | null;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  variables: PromptVariable[] | null;
  authorName?: string | null;
  authorId?: string | null;
}

/**
 * Type for prompt search parameters
 */
export interface PromptSearchParams {
  query?: string;
  category?: PromptCategory | 'all';
  tags?: string[];
  authorId?: string;
  isPublic?: boolean;
  sortBy?: 'newest' | 'popular' | 'trending' | 'views';
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
  minRating?: number;
}

/**
 * Type for prompt statistics
 */
export interface PromptStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  downloadCount: number;
  averageRating?: number;
  ratingCount?: number;
  lastUpdated: Date;
  lastViewed?: Date;
}

/**
 * Type for prompt version history
 */
export interface PromptVersion {
  id: string;
  version: number;
  createdAt: Date;
  changes: string[];
  author: Pick<User, 'id' | 'name' | 'image'>;
}

/**
 * Type for prompt usage statistics
 */
export interface PromptUsageStats {
  totalRuns: number;
  successfulRuns: number;
  averageExecutionTime: number;
  lastRunAt: Date | null;
  runCountByDay: Record<string, number>;
  errorRate: number;
}

/**
 * Type for prompt feedback
 */
export interface PromptFeedback {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  user: Pick<User, 'id' | 'name' | 'image'>;
  metadata?: Record<string, unknown>;
}