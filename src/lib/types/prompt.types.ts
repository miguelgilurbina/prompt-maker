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
  votes: number;              // Contador de votos
  comments: PromptComment[];  // Array de comentarios
  authorName?: string;        // Nombre del autor (para prompts anónimos)
   isPublic?: boolean;
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

// Categorías de prompts
export type PromptCategory = 
  | 'creative-writing'
  | 'technical'
  | 'business'
  | 'academic'
  | 'general'
  | 'custom';
