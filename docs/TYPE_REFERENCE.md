# Type Reference Document
## Prisma Schema to Frontend Types Mapping

This document provides a comprehensive mapping between Prisma database models and frontend TypeScript types used throughout the application.

## Table of Contents
- [Core Database Types](#core-database-types)
- [Frontend-Specific Types](#frontend-specific-types)
- [Type Conversion Utilities](#type-conversion-utilities)
- [Common Type Patterns](#common-type-patterns)
- [API Types](#api-types)
- [Form Types](#form-types)
- [Form Validation Types](#form-validation-types)
- [Component Props](#component-props)
- [Type Guards](#type-guards)
- [UI State Types](#ui-state-types)
- [Type Usage Guidelines](#type-usage-guidelines)
- [Type Usage Examples](#type-usage-examples)
- [Type Migration Guide](#type-migration-guide)

---

## Core Database Types

### BaseEntity
**Source**: `src/lib/types/database.types.ts`
**Purpose**: Base interface extended by all database models

```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `User`

```typescript
interface User extends BaseEntity {
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
```

**Usage**: Authentication, user profiles, author information

### Account
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `Account`

```typescript
interface Account extends BaseEntity {
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
  user: User;
}
```

**Usage**: OAuth provider accounts (Google, GitHub, etc.)

### Session
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `Session`

```typescript
interface Session extends BaseEntity {
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}
```

**Usage**: User authentication sessions

### Prompt (DatabasePrompt)
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `Prompt`
**Export Alias**: `DatabasePrompt` (to avoid naming conflicts)

```typescript
interface Prompt extends BaseEntity {
  title: string;
  description: string | null;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  authorName: string | null;
  variables: PromptVariable[] | null;
  views: number;
  authorId: string | null;
  author: User | null;
  comments: Comment[];
  votes: Vote[];
}
```

**Usage**: Core prompt data structure

### Comment
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `Comment`

```typescript
interface Comment extends BaseEntity {
  content: string;
  promptId: string;
  authorId: string | null;
  authorName: string | null;
  author: User | null;
  prompt: Prompt;
}
```

**Usage**: User comments on prompts

### Vote
**Source**: `src/lib/types/database.types.ts`
**Prisma Model**: `Vote`

```typescript
interface Vote extends BaseEntity {
  userId: string;
  promptId: string;
  user: Pick<User, 'id' | 'name' | 'image'>;
  prompt: Pick<Prompt, 'id' | 'title'>;
}
```

**Usage**: User votes/likes on prompts

### PromptVariable
**Source**: `src/lib/types/database.types.ts`
**Purpose**: Dynamic variables within prompts

```typescript
interface PromptVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiline';
  description?: string;
  defaultValue?: string | number;
  options?: string[];
  required?: boolean;
}
```

**Usage**: Template variables in prompt content

### PromptCategory
**Source**: `src/lib/types/database.types.ts`
**Purpose**: Categorization of prompts

```typescript
type PromptCategory = 
  | 'writing'
  | 'coding'
  | 'marketing'
  | 'education'
  | 'business'
  | 'creative'
  | 'other';
```

**Usage**: Prompt categorization and filtering

---

## Frontend-Specific Types

### UIPrompt
**Source**: `src/lib/types/database.types.ts`
**Purpose**: Extended prompt type with UI metadata

```typescript
interface UIPrompt extends Prompt {
  isOwner?: boolean;
  hasVoted?: boolean;
  voteCount?: number;
  commentCount?: number;
  authorInfo?: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
}
```

**Usage**: Displaying prompts in lists and detail views with additional UI state

---

## Type Conversion Utilities

### normalizePrompt
**Source**: `src/lib/types/prompt.ts`  
**Purpose**: Converts a database Prompt to a UIPrompt with additional UI metadata

```typescript
function normalizePrompt(
  prompt: Prompt, 
  userId?: string
): UIPrompt
```

**Usage**:
```typescript
const uiPrompt = normalizePrompt(databasePrompt, currentUserId);
```

---

## Common Type Patterns

### WithOptional
**Source**: `src/lib/types/utility.types.ts`  
**Purpose**: Makes specified properties optional in a type

```typescript
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

### Nullable
**Source**: `src/lib/types/utility.types.ts`  
**Purpose**: Makes all properties nullable

```typescript
type Nullable<T> = { [P in keyof T]: T[P] | null };
```

### ApiResponse
**Source**: `src/lib/types/api.types.ts`  
**Purpose**: Standard API response wrapper

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}
```

### PaginatedResponse
**Source**: `src/lib/types/api.types.ts`  
**Purpose**: Standard paginated response

```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Form Validation Types

### ValidationRules
**Source**: `src/lib/validation/schemas.ts`  
**Purpose**: Defines validation rules for form fields

```typescript
interface ValidationRules {
  required?: boolean | string;
  minLength?: [number, string?];
  maxLength?: [number, string?];
  pattern?: [RegExp, string];
  validate?: (value: any) => string | boolean;
}
```

### FieldError
**Source**: `src/lib/validation/schemas.ts`  
**Purpose**: Represents a form field validation error

```typescript
interface FieldError {
  field: string;
  message: string;
  type: string;
}
```

---

## Component Props

### CardProps
**Source**: `src/components/ui/Card.tsx`  
**Purpose**: Base props for card components

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}
```

### ButtonProps
**Source**: `src/components/ui/Button.tsx`  
**Purpose**: Base props for button components

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

---

## Type Guards

### isUIPrompt
**Source**: `src/lib/types/type-guards.ts`  
**Purpose**: Runtime type checking for UIPrompt

```typescript
function isUIPrompt(prompt: unknown): prompt is UIPrompt {
  return (
    typeof prompt === 'object' && 
    prompt !== null &&
    'id' in prompt &&
    'title' in prompt
  );
}
```

### isApiError
**Source**: `src/lib/types/type-guards.ts`  
**Purpose**: Runtime type checking for API errors

```typescript
function isApiError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}
```

---

## API Types

### ApiResponse
**Source**: `src/lib/types/api.types.ts`
**Purpose**: Standard API response wrapper

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

**Usage**: All API endpoint responses

### PaginatedResponse
**Source**: `src/lib/types/api.types.ts`
**Purpose**: Paginated API responses

```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

**Usage**: List endpoints with pagination

### PromptApiResponse
**Source**: `src/lib/types/api.types.ts`
**Purpose**: API response for prompt data

```typescript
interface PromptApiResponse extends Omit<Prompt, 'author'> {
  author?: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  } | null;
}
```

**Usage**: Prompt data from API endpoints

---

## Form Types

### PromptFormData
**Source**: `src/lib/types/prompt.types.ts`
**Purpose**: Form data for creating/editing prompts

```typescript
interface PromptFormData {
  id?: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  variables: PromptVariable[];
  authorName?: string | null;
  authorId?: string | null;
}
```

**Usage**: Prompt creation and editing forms

### PromptSearchParams
**Source**: `src/lib/types/prompt.types.ts`
**Purpose**: Search and filtering parameters

```typescript
interface PromptSearchParams {
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
```

**Usage**: Search and filter functionality

---

## UI State Types

### PromptEditorState
**Source**: `src/lib/types/ui-states.types.ts`
**Purpose**: State management for prompt editor

```typescript
interface PromptEditorState {
  currentPrompt: DatabasePrompt | null;
  isDirty: boolean;
  isLoading: boolean;
  lastSaved?: Date;
  validationErrors: Record<string, string>;
}
```

**Usage**: Prompt builder/editor component state

---

## Type Usage Examples

### Creating a New Prompt
```typescript
const newPrompt: PromptFormData = {
  title: 'My New Prompt',
  description: 'A description of my prompt',
  content: 'This is the prompt content with {{variable}}',
  category: 'writing',
  tags: ['creative', 'writing'],
  isPublic: true,
  variables: [{
    id: 'var1',
    name: 'variable',
    type: 'text',
    description: 'A variable to be replaced',
    required: true
  }]
};
```

### Handling API Responses
```typescript
async function fetchPrompt(id: string): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}`);
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message || 'Failed to fetch prompt');
  }
  return response.json();
}
```

### Using Type Guards
```typescript
function processPrompt(prompt: unknown) {
  if (isUIPrompt(prompt)) {
    // TypeScript now knows this is a UIPrompt
    console.log(`Processing prompt: ${prompt.title}`);
  } else {
    console.error('Invalid prompt format');
  }
}
```

---

## Type Migration Guide

### From Database to UI
When moving data from the database to the UI:
1. Use `normalizePrompt` to convert database prompts to UI prompts
2. Add UI-specific metadata (isOwner, hasVoted, etc.)
3. Handle null/undefined cases appropriately

### From UI to Database
When sending data back to the server:
1. Strip UI-specific fields using `Omit<UIPrompt, 'isOwner' | 'hasVoted'>`
2. Validate the data matches the expected database schema
3. Use type assertions only when necessary and safe

### Handling Version Changes
When database models change:
1. Update the corresponding TypeScript interfaces
2. Add migration scripts for existing data
3. Update any type guards or validation functions
4. Test thoroughly with both old and new data formats

---

## Type Usage Guidelines

### Import Patterns

**✅ Recommended**: Import from central index
```typescript
import { DatabasePrompt, UIPrompt, PromptFormData } from '@/lib/types';
```

**❌ Avoid**: Direct imports from specific files
```typescript
import { Prompt } from '@/lib/types/database.types'; // Don't do this
```

### Naming Conventions

- **Database types**: Use exact Prisma model names or `Database` prefix for conflicts
- **UI types**: Prefix with `UI` (e.g., `UIPrompt`)
- **Form types**: Suffix with `FormData` (e.g., `PromptFormData`)
- **API types**: Suffix with `ApiResponse` or `ApiRequest`
- **State types**: Suffix with `State` (e.g., `PromptEditorState`)

### Type Safety Best Practices

1. **Always handle nullable fields**: Many database fields are `string | null`
2. **Use type guards**: Validate data at runtime boundaries
3. **Prefer composition over inheritance**: Extend base types for specific use cases
4. **Use Pick/Omit for partial types**: Create focused interfaces for specific contexts

### Common Type Transformations

**Database to UI**:
```typescript
const uiPrompt: UIPrompt = {
  ...databasePrompt,
  voteCount: databasePrompt.votes.length,
  commentCount: databasePrompt.comments.length,
  isOwner: databasePrompt.authorId === currentUserId
};
```

**Form to Database**:
```typescript
const promptToSave: Omit<DatabasePrompt, 'id' | 'createdAt' | 'updatedAt'> = {
  ...formData,
  views: 0,
  author: null,
  comments: [],
  votes: []
};
```

---

## Migration Notes

### Deprecated Types (Removed)
- `PromptWithMetadata` → Use `UIPrompt`
- `PromptWithId` → Use `DatabasePrompt` or `UIPrompt`
- `ApiPrompt` → Use `PromptApiResponse`

### Breaking Changes
- All `Prompt` references renamed to `DatabasePrompt` in exports
- Nullable fields now properly typed as `string | null` instead of optional
- Author relationships restructured for better type safety

---

*Last Updated: 2025-07-02*
*Version: 1.0.0*
