import { Prompt, PromptCategory, PromptVariable } from "@/lib/types/prompt.types";

// lib/types/actions.ts

// Acciones del editor
export type EditorAction = 
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'ADD_VARIABLE'; payload: PromptVariable }
  | { type: 'REMOVE_VARIABLE'; payload: string }
  | { type: 'SET_PREVIEW'; payload: boolean }
  | { type: 'SAVE_PROMPT' }
  | { type: 'RESET_EDITOR' };

// Acciones de la biblioteca
export type LibraryAction =
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'REMOVE_PROMPT'; payload: string }
  | { type: 'UPDATE_PROMPT'; payload: Prompt }
  | { type: 'SET_CATEGORY_FILTER'; payload: PromptCategory }
  | { type: 'SET_TAG_FILTER'; payload: string[] };