import { Prompt, PromptCategory } from "@/lib/types/prompt";

export const createEmptyPrompt = (): Prompt => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
  tags: [],
  category: "general" as PromptCategory,
  createdAt: new Date(),
  updatedAt: new Date(),
  variables: []
});

export const mergeWithEmptyPrompt = (initial: Partial<Prompt>): Prompt => ({
  ...createEmptyPrompt(),
  ...initial,
});