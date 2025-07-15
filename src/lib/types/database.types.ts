// src/lib/types/database.types.ts
// Core database types that map directly to Prisma models

/**
 * Base entity interface that all database models extend
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User type
export interface User extends BaseEntity {
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string | null;
  // Relationships
  accounts: Account[];
  sessions: Session[];
  prompts: Prompt[];
  comments: Comment[];
  votes: Vote[];
}

// Account type for authentication
export interface Account extends BaseEntity {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  // Relationships
  user: User;
}

// Session type
export interface Session extends BaseEntity {
  sessionToken: string;
  userId: string;
  expires: Date;
  // Relationships
  user: User;
}

// Verification Token type
export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Prompt category type
export type PromptCategory = 
  | 'creative-writing'
  | 'technical'
  | 'business'
  | 'academic'
  | 'general'
  | 'custom';

// Base Prompt type (database model)
export interface Prompt extends BaseEntity {
  title: string;
  description: string | null;
  content: string;
  category: PromptCategory;
  isPublic: boolean;
  authorId: string | null;
  // author: User | null;
  // views: number;
  // likes: number;
  // Relationships
  author: User | null;
  // comments: Comment[];
  // votes: Vote[];
}

// Comment type
export interface Comment extends BaseEntity {
  content: string;
  promptId: string;
  authorId: string | null;
  authorName: string | null;
  // Relationships
  author: User | null;
  prompt: Prompt;
}

// Vote type
export interface Vote extends BaseEntity {
  userId: string;
  promptId: string;
  user: User;
  prompt: Pick<Prompt, 'id' | 'title'>;
}

/**
 * Extended prompt type for UI with additional metadata
 * Used for displaying prompts in lists and detail views
 */
export interface UIPrompt extends Omit<Prompt, 'author'> {
  isOwner?: boolean;
  hasVoted?: boolean;
  voteCount?: number;
  commentCount?: number;
  authorInfo?: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
}
