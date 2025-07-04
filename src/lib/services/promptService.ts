// lib/services/promptService.ts

import type { PromptFormData } from '@/lib/types/prompt.types';

interface SavePromptOptions {
  prompt: Omit<PromptFormData, 'authorId' | 'authorName'>;
  isPublic?: boolean;
}

export async function savePrompt({ prompt, isPublic = false }: SavePromptOptions) {
  console.group('savePrompt');
  console.log('Input data:', { prompt, isPublic });
  
  try {
    const requestBody = {
      ...prompt,
      isPublic,
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails: Record<string, unknown> = {};
      
      try {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Handle different error response formats
        if (typeof errorData === 'object' && errorData !== null) {
          if ('error' in errorData && typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if ('message' in errorData && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          }
          errorDetails = errorData;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      const error = new Error(errorMessage);
      Object.assign(error, { details: errorDetails });
      throw error;
    }
    
    const responseData = await response.json();
    console.log('Success response:', responseData);
    
    return { 
      success: true, 
      data: responseData 
    };
  } catch (error) {
    console.error('Error in savePrompt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save prompt' 
    };
  } finally {
    console.groupEnd();
  }
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