import React, { createContext, useContext, useState, useCallback } from "react";
import type { PromptFormData, PromptVariable, PromptCategory } from "@/lib/types/prompt.types";
import type { PromptEditorState } from "@/lib/types/ui-states.types";

// Import types from database
import type { Prompt as DBPrompt } from "@/lib/types/database.types";

// Helper type to convert DBPrompt to PromptFormData
const dbPromptToFormData = (dbPrompt: DBPrompt): PromptFormData => ({
  id: dbPrompt.id,
  title: dbPrompt.title,
  description: dbPrompt.description,
  content: dbPrompt.content,
  category: dbPrompt.category as PromptCategory,
  tags: dbPrompt.tags,
  isPublic: dbPrompt.isPublic,
  variables: dbPrompt.variables as PromptVariable[] | null,
  authorId: dbPrompt.authorId,
  authorName: dbPrompt.author?.name || null,
});

interface PromptContextType {
  // Editor state
  editorState: PromptEditorState;
  categories: PromptCategory[];
  setCategory: (category: PromptCategory) => void;
  
  // Prompt manipulation methods
  setCurrentPrompt: (prompt: DBPrompt | PromptFormData | null) => void;
  updatePromptContent: (content: string) => void;
  updateVariable: (id: string, value: string) => void;
  togglePreviewMode: () => void;
  
  // Variable management
  extractVariables: (content: string) => PromptVariable[];
  replaceVariables: (content: string) => string;
  
  // History management
  addToHistory: (content: string) => void;
  
  // Dirty state
  setIsDirty: (isDirty: boolean) => void;
}

const initialEditorState: PromptEditorState = {
  currentPrompt: {
    title: '',
    description: null,
    content: '',
    category: 'general',
    tags: [],
    isPublic: false,
    variables: null,
  },
  isDirty: false,
  validationErrors: {},
  variables: new Map<string, string>(),
  history: [],
  previewMode: false,
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [editorState, setEditorState] =
    useState<PromptEditorState>(initialEditorState);

  const setCurrentPrompt = useCallback((prompt: DBPrompt | PromptFormData | null) => {
    if (!prompt) {
      // Reset to initial state if prompt is null
      setEditorState(initialEditorState);
      return;
    }

    // Convert DBPrompt to PromptFormData if needed
    const formData = 'author' in prompt ? dbPromptToFormData(prompt) : prompt;
    
    setEditorState((prev) => ({
      ...prev,
      currentPrompt: formData,
      isDirty: false,
      variables: new Map(
        formData.variables?.map((v: PromptVariable) => [
          v.id, 
          // Ensure value is always a string
          v.defaultValue !== undefined && v.defaultValue !== null 
            ? String(v.defaultValue) 
            : ""
        ]) || []
      ),
    }));
  }, []);

  const updatePromptContent = useCallback((content: string) => {
    setEditorState((prev) => ({
      ...prev,
      currentPrompt: {
        ...prev.currentPrompt,
        content,
      },
      isDirty: true,
    }));
  }, []);

  const [categories] = useState<PromptCategory[]>([
    "creative-writing",
    "technical",
    "business",
    "academic",
    "general",
    "custom",
  ]);

  const setCategory = useCallback((category: PromptCategory) => {
    setEditorState((prev) => ({
      ...prev,
      currentPrompt: {
        ...prev.currentPrompt,
        category,
      },
      isDirty: true,
    }));
  }, []);

  const updateVariable = useCallback((id: string, value: string) => {
    setEditorState((prev) => ({
      ...prev,
      variables: new Map(prev.variables).set(id, value),
      isDirty: true,
    }));
  }, []);

  const extractVariables = useCallback((content: string): PromptVariable[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...content.matchAll(regex)];
    return matches.map((match, index) => ({
      id: `var_${index}`,
      name: match[1].trim(),
      type: "text",
    }));
  }, []);

  const replaceVariables = useCallback(
    (content: string): string => {
      let result = content;
      editorState.variables.forEach((value, key) => {
        const variable = editorState.currentPrompt?.variables?.find(
          (v) => v.id === key
        );
        if (variable) {
          result = result.replace(`{{${variable.name}}}`, value);
        }
      });
      return result;
    },
    [editorState.variables, editorState.currentPrompt]
  );

  const togglePreviewMode = useCallback(() => {
    setEditorState((prev) => ({
      ...prev,
      previewMode: !prev.previewMode,
    }));
  }, []);

  const addToHistory = useCallback((content: string) => {
    setEditorState((prev) => ({
      ...prev,
      history: [...prev.history, content].slice(-50), // Mantener últimos 50 cambios
    }));
  }, []);

  const setIsDirty = useCallback((isDirty: boolean) => {
    setEditorState((prev) => ({
      ...prev,
      isDirty,
    }));
  }, []);

  return (
    <PromptContext.Provider
      value={{
        categories,
        setCategory,
        editorState,
        setCurrentPrompt,
        updatePromptContent,
        updateVariable,
        extractVariables,
        replaceVariables,
        togglePreviewMode,
        addToHistory,
        setIsDirty,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePromptContext = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }
  return context;
};
