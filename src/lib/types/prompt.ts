// src/types/prompt.ts
export interface Prompt {
    prompt: {
      title: string;
      content: string;
      tags?: string[];
    };
  }
  
  export interface PromptCardProps {
    prompt: Prompt;
  }