// src/lib/services/api.ts
// API service functions for interacting with the backend

import { 
  PromptFormData
} from '@/lib/types';

/**
 * Type for prompt variable types
 */


export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';



// Helper for logging
const logRequest = (method: string, url: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔗 ${method} Request to: ${url}`);
    if (data) console.log('📦 Data:', data);
  }
};

// Common fetch function with error handling
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Response error:', response.status, errorText);
    throw new Error(errorText || 'Request failed');
  }

  return response.json();
}

// Funciones para prompts públicos
export async function fetchPublicPrompts(page = 1, limit = 10, search = '') {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {})
  });
  
  const url = `${API_URL}/api/public/prompts?${queryParams}`;
  logRequest('GET', url);
  
  return fetchWithAuth(url);
}

// Fetch user's personal prompts
export async function fetchUserPrompts(page = 1, limit = 10, search = '') {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search ? { search } : {})
  });
  
  const url = `${API_URL}/api/prompt?${queryParams}`;
  logRequest('GET', url);
  
  return fetchWithAuth(url);
}

export async function fetchPromptById(id: string, isPublic = true) {
  const basePath = isPublic ? 'public/prompts' : 'prompt';
  const url = `${API_URL}/api/${basePath}/${id}`;
  logRequest('GET', url);
  
  return fetchWithAuth(url);
}

export async function voteForPrompt(promptId: string) {
  const url = `${API_URL}/api/public/prompts/${promptId}/vote`;
  logRequest('POST', url);
  
  return fetchWithAuth(url, {
    method: 'POST',
  });
}

export async function addCommentToPrompt(promptId: string, text: string, authorName: string) {
  const url = `${API_URL}/api/public/prompts/${promptId}/comment`;
  logRequest('POST', url, { text, authorName });
  
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify({ text, authorName })
  });
}



// Save or update a prompt
export async function savePrompt(promptData: PromptFormData, isNew = true) {
  const url = `${API_URL}/api/prompt${isNew ? '' : `/${promptData.id}`}`;
  const method = isNew ? 'POST' : 'PUT';
  
  logRequest(method, url, promptData);
  
  return fetchWithAuth(url, {
    method,
    body: JSON.stringify(promptData)
  });
}

// Delete a prompt
export async function deletePrompt(promptId: string) {
  const url = `${API_URL}/api/prompt/${promptId}`;
  logRequest('DELETE', url);
  
  return fetchWithAuth(url, {
    method: 'DELETE',
  });
}