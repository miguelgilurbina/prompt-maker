// lib/services/promptService.ts

import type { PromptInput } from '@shared/types/prompt.types';
import type { Prompt } from '@prisma/client';

export async function savePrompt(prompt: PromptInput): Promise<Prompt> {
  const response = await fetch('/api/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt)
  });
  
  if (!response.ok) throw new Error('Failed to save prompt');
  return response.json();
}

export async function fetchPrompts(params: {
  page?: number;
  limit?: number;
  search?: string;
  isPublic?: boolean;
}) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    limit: String(params.limit || 10),
    ...(params.search && { search: params.search }),
    ...(params.isPublic !== undefined && { isPublic: String(params.isPublic) })
  });
  
  const response = await fetch(`/api/prompts?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch prompts');
  return response.json();
}