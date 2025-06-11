// Biblioteca de prompts
import { Prompt, PromptCategory } from "@/lib/types/prompt.types";


export interface PromptLibrary {
  prompts: Prompt[];
  categories: Set<PromptCategory>;
  tags: Set<string>;
}

// Estado del editor
export interface PromptEditorState {
  currentPrompt: Prompt | null;
  isDirty: boolean;
  variables: Map<string, string>;
  history: string[];
  previewMode: boolean;
}