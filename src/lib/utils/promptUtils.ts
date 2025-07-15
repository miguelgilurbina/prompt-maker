
import type { Prompt, PromptCategory } from "@/lib/types/database.types";

export const createEmptyPrompt = (): Prompt => ({
  id: crypto.randomUUID(),
  title: "",
  description: null,
  content: "",
  category: "general" as PromptCategory,
  isPublic: false,
  authorId: null,
  author: null,
  createdAt: new Date(),
  updatedAt: new Date()
});

export const mergeWithEmptyPrompt = (initial?: Partial<Prompt>): Prompt => ({
  ...createEmptyPrompt(),
  ...initial,
});

