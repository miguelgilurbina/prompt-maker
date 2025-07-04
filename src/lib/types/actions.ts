import type { Prompt, PromptVariable, PromptCategory } from './database.types';

/**
 * Editor Actions
 * These actions are used to manage the prompt editor state
 */
export type EditorAction = 
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'ADD_VARIABLE'; payload: PromptVariable }
  | { type: 'REMOVE_VARIABLE'; payload: string }
  | { type: 'UPDATE_VARIABLE'; payload: { id: string; variable: Partial<PromptVariable> } }
  | { type: 'SET_PREVIEW'; payload: boolean }
  | { type: 'SAVE_PROMPT' }
  | { type: 'RESET_EDITOR' };

/**
 * Library Actions
 * These actions are used to manage the prompt library
 */
export type LibraryAction =
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'REMOVE_PROMPT'; payload: string }
  | { type: 'UPDATE_PROMPT'; payload: Prompt }
  | { type: 'SET_CATEGORY_FILTER'; payload: PromptCategory | 'all' }
  | { type: 'SET_TAG_FILTER'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

/**
 * Combined action types for the entire application
 */
export type AppAction = EditorAction | LibraryAction;

/**
 * Action creator functions
 */
export const createAction = {
  // Editor actions
  updateContent: (content: string): EditorAction => ({
    type: 'UPDATE_CONTENT',
    payload: content,
  }),
  
  addVariable: (variable: PromptVariable): EditorAction => ({
    type: 'ADD_VARIABLE',
    payload: variable,
  }),
  
  removeVariable: (id: string): EditorAction => ({
    type: 'REMOVE_VARIABLE',
    payload: id,
  }),
  
  updateVariable: (id: string, variable: Partial<PromptVariable>): EditorAction => ({
    type: 'UPDATE_VARIABLE',
    payload: { id, variable },
  }),
  
  setPreview: (isPreview: boolean): EditorAction => ({
    type: 'SET_PREVIEW',
    payload: isPreview,
  }),
  
  savePrompt: (): EditorAction => ({
    type: 'SAVE_PROMPT',
  }),
  
  resetEditor: (): EditorAction => ({
    type: 'RESET_EDITOR',
  }),
  
  // Library actions
  addPrompt: (prompt: Prompt): LibraryAction => ({
    type: 'ADD_PROMPT',
    payload: prompt,
  }),
  
  removePrompt: (id: string): LibraryAction => ({
    type: 'REMOVE_PROMPT',
    payload: id,
  }),
  
  updatePrompt: (prompt: Prompt): LibraryAction => ({
    type: 'UPDATE_PROMPT',
    payload: prompt,
  }),
  
  setCategoryFilter: (category: PromptCategory | 'all'): LibraryAction => ({
    type: 'SET_CATEGORY_FILTER',
    payload: category,
  }),
  
  setTagFilter: (tags: string[]): LibraryAction => ({
    type: 'SET_TAG_FILTER',
    payload: tags,
  }),
  
  setSearchQuery: (query: string): LibraryAction => ({
    type: 'SET_SEARCH_QUERY',
    payload: query,
  }),
};