// src/types/prompt.ts

//Tipo base para un prompt

export interface Prompt {
  id: string;
  title: string;
  description?: string;
  content: string;
  tags: string[];
  category: PromptCategory;
  createdAt: Date;
  updatedAt: Date;
  variables?: PromptVariable[];
  isTemplate?: boolean;
  }

  // Variables que pueden ser reemplazadas en el prompt
export interface PromptVariable {
  id: string;
  name: string;
  description?: string;
  defaultValue?: string;
  type: 'text' | 'number' | 'select' | 'multiline';
  options?: string[];  // Para variables tipo 'select'
}

export interface Template {
  id: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  category: string[];
}

// Categorías de prompts
export type PromptCategory = 
  | 'creative-writing'
  | 'technical'
  | 'business'
  | 'academic'
  | 'general'
  | 'custom';

// Estado del editor
export interface PromptEditorState {
  currentPrompt: Prompt | null;
  isDirty: boolean;
  variables: Map<string, string>;
  history: string[];
  previewMode: boolean;
}

// Biblioteca de prompts
export interface PromptLibrary {
  prompts: Prompt[];
  categories: Set<PromptCategory>;
  tags: Set<string>;
}

// Configuración de almacenamiento
export interface StorageConfig {
  autoSave: boolean;
  backupFrequency: number;
  maxHistorySize: number;
  storageKey: string;
}
  
export interface PromptCardProps {
  prompt: Prompt;
}