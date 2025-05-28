import { Prompt, PromptCategory } from "@shared/types/prompt.types";

export const createEmptyPrompt = (): Prompt => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
  tags: [],
  category: "general" as PromptCategory,
  createdAt: new Date(),
  updatedAt: new Date(),
  variables: [],
  votes: 0,
  comments: []
});

export const mergeWithEmptyPrompt = (initial: Partial<Prompt>): Prompt => ({
  ...createEmptyPrompt(),
  ...initial,
});