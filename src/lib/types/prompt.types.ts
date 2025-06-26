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
  votes: number;
  comments: PromptComment[];
  authorName?: string;
  isPublic?: boolean;
}

export interface PromptVariable {
  id: string;
  name: string;
  description?: string;
  defaultValue?: string;
  type: 'text' | 'number' | 'select' | 'multiline';
  options?: string[];
}

export interface PromptComment {
  id?: string;
  text: string;
  authorName: string;
  userId?: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  category: string[];
}

export type PromptCategory = 
  | 'creative-writing'
  | 'technical'
  | 'business'
  | 'academic'
  | 'general'
  | 'custom';
