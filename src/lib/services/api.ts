// frontend/src/lib/services/api.ts
import { Prompt } from "@/lib/types/prompt.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper para logging
const logRequest = (method: string, url: string, data?: unknown) => {
  console.log(`🔗 ${method} Request to: ${url}`);
  if (data) console.log('📦 Data:', data);
};

// Funciones para prompts públicos
export async function fetchPublicPrompts(page = 1, limit = 10, search = '') {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {})
  });
  
  // CAMBIO IMPORTANTE: Añadir /api antes de /public
  const url = `${API_URL}/api/public/prompts?${queryParams}`;
  logRequest('GET', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Response error:', response.status, errorText);
    throw new Error('Failed to fetch prompts');
  }
  
  const data = await response.json();
  console.log('✅ Prompts received:', data);
  return data;
}

export async function fetchPromptById(id: string) {
  // CAMBIO: Añadir /api
  const url = `${API_URL}/api/public/prompts/${id}`;
  logRequest('GET', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch prompt');
  }
  
  return await response.json();
}

export async function voteForPrompt(promptId: string) {
  // CAMBIO: Añadir /api
  const url = `${API_URL}/api/public/prompts/${promptId}/vote`;
  logRequest('POST', url);
  
  const response = await fetch(url, {
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
  // CAMBIO: Añadir /api
  const url = `${API_URL}/api/public/prompts/${promptId}/comment`;
  logRequest('POST', url, { text, authorName });
  
  const response = await fetch(url, {
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
  // CAMBIO: Añadir /api
  const url = `${API_URL}/api/public/prompts`;
  logRequest('POST', url, promptData);
  
  const response = await fetch(url, {
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