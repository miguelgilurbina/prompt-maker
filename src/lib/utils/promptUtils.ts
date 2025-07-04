
import type { Prompt, PromptCategory } from "@/lib/types/database.types";

export const createEmptyPrompt = (): Prompt => ({
  id: crypto.randomUUID(),
  title: "",
  description: null,
  content: "",
  category: "general" as PromptCategory,
  tags: [],
  isPublic: false,
  authorName: null,
  variables: null,
  views: 0,
  authorId: null,
  author: null,
  comments: [],
  votes: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

export const mergeWithEmptyPrompt = (initial?: Partial<Prompt>): Prompt => ({
  ...createEmptyPrompt(),
  ...initial,
});

