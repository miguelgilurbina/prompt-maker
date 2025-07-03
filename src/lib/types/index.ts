// src/lib/types/index.ts
// Central exports for all types - Single source of truth for type imports

// 1. Core database types (Prisma models)
export type {
  Account,
  BaseEntity,
  Comment,
  Prompt as DatabasePrompt,  // Renamed to avoid conflicts
  PromptCategory,
  PromptVariable,
  Session,
  UIPrompt,
  User,
  VerificationToken,
  Vote
} from './database.types';

// 2. API types (requests/responses)
export type {
  ApiResponse,
  PaginatedResponse,
  PromptApiRequest,
  PromptApiResponse,
  ApiError,
  AuthResponse
} from './api.types';

// 3. Prompt-related types (forms, search, etc.)
export type {
  PromptFormData,
  PromptSearchParams,
  PromptStats,
  PromptUsageStats,
  PromptFeedback,
  PromptVersion
} from './prompt.types';

// 4. UI State types
export type {
  EditorPrompt,
  PromptEditorState
} from './ui-states.types';

// 5. Action types
export type { 
  EditorAction, 
  LibraryAction, 
  AppAction 
} from './actions';

export { createAction } from './actions';

// 6. Re-export commonly used types for convenience
export type { Prompt as PromptType } from './database.types';

// 7. Namespaced exports for better organization
import * as ApiTypes from './api.types';
import * as ConfigTypes from './config.types';
import * as PromptTypes from './prompt.types';
import * as StorageTypes from './storage';
import * as ThemeTypes from './theme';
import * as UIActionTypes from './actions';
import * as UIStateTypes from './ui-states.types';

export {
  ApiTypes,
  ConfigTypes,
  PromptTypes,
  StorageTypes,
  ThemeTypes,
  UIActionTypes,
  UIStateTypes,
};

// 8. Common type utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// 9. Type guards
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// 10. Type assertion functions
export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
