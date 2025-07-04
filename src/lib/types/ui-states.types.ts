// UI State Type Definitions
// This file contains type definitions for UI state management

import type { 
  Prompt, 
  PromptCategory, 
  User 
} from './database.types';
import { PromptFormData } from './prompt.types';

/**
 * Interface for the prompt library state
 */
export interface PromptLibrary {
  prompts: Prompt[];
  categories: Set<PromptCategory>;
  tags: Set<string>;
}

/**
 * Extended prompt type for the editor with optional fields
 */
export interface EditorPrompt extends Omit<Prompt, 'updatedAt' | 'createdAt' | 'id' | 'author'> {
  id?: string;
  updatedAt?: Date | string;
  createdAt?: Date | string;
  author?: string | Pick<User, 'id' | 'name' | 'email' | 'image'>;
}

/**
 * State interface for the prompt editor
 */
export interface PromptEditorState {
  currentPrompt: PromptFormData;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  variables: Map<string, string>;
  history: string[];
  previewMode: boolean;
}