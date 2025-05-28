// frontend/src/lib/services/api.ts
import { Prompt } from "@shared/types/prompt.types";
// import {PromptComments} from "../../components/prompts/PromptComments";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Funciones para prompts públicos
export async function fetchPublicPrompts(page = 1, limit = 10, search = '') {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {})
  });
  
  const response = await fetch(`${API_URL}/public/prompts?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  
  return await response.json();
}

export async function fetchPromptById(id: string) {
  const response = await fetch(`${API_URL}/public/prompts/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch prompt');
  }
  
  return await response.json();
}

export async function voteForPrompt(promptId: string) {
  const response = await fetch(`${API_URL}/public/prompts/${promptId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to vote for prompt');
  }
  
  return await response.json();
}

export async function addCommentToPrompt(promptId: string, text: string, authorName: string) {
  const response = await fetch(`${API_URL}/public/prompts/${promptId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, authorName })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  
  return await response.json();
}

export async function createAnonymousPrompt(promptData: Partial<Prompt>) {
  const response = await fetch(`${API_URL}/public/prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...promptData,
      isPublic: true
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create prompt');
  }
  
  return await response.json();
}