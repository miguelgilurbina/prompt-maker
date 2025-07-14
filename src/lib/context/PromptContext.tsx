import React, { createContext, useContext, useState, useCallback } from "react";
import type { PromptCategory, PromptFormData } from "@/lib/types";

// Import types from database
import type { Prompt as DBPrompt } from "@/lib/types/database.types";

interface PromptEditorState {
  currentPrompt: PromptFormData;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  previewMode: boolean;
  lastSaved?: Date;
}

interface PromptContextType {
  // Editor state
  editorState: PromptEditorState;
  categories: PromptCategory[];
  setCategory: (category: PromptCategory) => void;

  // Prompt manipulation methods
  setCurrentPrompt: (prompt: DBPrompt | PromptFormData | null) => void;
  updatePromptContent: (content: string) => void;
  togglePreviewMode: () => void;

  // History management
  addToHistory: (content: string) => void;

  // Dirty state
  setIsDirty: (isDirty: boolean) => void;
}

const initialEditorState: PromptEditorState = {
  currentPrompt: {
    title: "",
    description: null,
    content: "",
    category: "general",
    tags: [],
    isPublic: false,
  },
  isDirty: false,
  validationErrors: {},
  previewMode: false,
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [editorState, setEditorState] =
    useState<PromptEditorState>(initialEditorState);

  const setCurrentPrompt = useCallback(
    (prompt: DBPrompt | PromptFormData | null) => {
      if (!prompt) {
        // Reset to initial state if prompt is null
        setEditorState(initialEditorState);
        return;
      }

      setEditorState((prev) => ({
        ...prev,
        currentPrompt: prompt,
        isDirty: false,
      }));
    },
    []
  );

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
