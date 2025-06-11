import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Prompt,
  PromptVariable,
  PromptCategory,
} from "@/lib/types/prompt.types";
import { PromptEditorState } from "../types/ui-states.types";

interface PromptContextType {
  // Estado del editor
  editorState: PromptEditorState;
  categories: PromptCategory[];
  setCategory: (category: PromptCategory) => void;
  // Métodos para manipular prompts
  setCurrentPrompt: (prompt: Prompt | null) => void;
  updatePromptContent: (content: string) => void;
  updateVariable: (id: string, value: string) => void;
  togglePreviewMode: () => void;
  // Métodos para gestión de variables
  extractVariables: (content: string) => PromptVariable[];
  replaceVariables: (content: string) => string;
  // Gestión de historial
  addToHistory: (content: string) => void;
  // Estado sucio
  setIsDirty: (isDirty: boolean) => void;
}

const initialEditorState: PromptEditorState = {
  currentPrompt: null,
  isDirty: false,
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

  const setCurrentPrompt = useCallback((prompt: Prompt | null) => {
    setEditorState((prev) => ({
      ...prev,
      currentPrompt: prompt,
      isDirty: false,
      variables: new Map(
        prompt?.variables?.map((v: PromptVariable) => [
          v.id,
          v.defaultValue || "",
        ]) || []
      ),
    }));
  }, []);

  const updatePromptContent = useCallback((content: string) => {
    setEditorState((prev) => ({
      ...prev,
      currentPrompt: prev.currentPrompt
        ? {
            ...prev.currentPrompt,
            content,
          }
        : null,
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
      currentPrompt: prev.currentPrompt
        ? {
            ...prev.currentPrompt,
            category,
          }
        : null,
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
