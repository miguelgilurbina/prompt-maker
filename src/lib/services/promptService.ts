// src/lib/services/promptService.ts
import { Prompt as PromptType } from '@shared/types/prompt.types';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type SavePromptResponse = ApiResponse<PromptType>;
type FetchPromptsResponse = ApiResponse<PaginatedResponse<PromptType>>;

interface SavePromptParams extends Omit<Partial<PromptType>, 'id' | 'createdAt' | 'updatedAt'> {
  title: string;
  content: string;
  isPublic?: boolean;
}

/**
 * Saves a prompt to the backend
 * @param prompt The prompt data to save
 * @param isPublic Whether the prompt should be public
 * @returns Promise with the save result
 */
export const savePrompt = async (
  prompt: SavePromptParams,
  isPublic: boolean = true
): Promise<SavePromptResponse> => {
  try {
    const endpoint = isPublic 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/public/prompts` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/prompt`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: For authenticated routes, the auth middleware will handle the token
      },
      body: JSON.stringify({
        ...prompt,
        isPublic,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save prompt');
    }

    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error saving prompt:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An error occurred while saving the prompt';
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

/**
 * Fetches public prompts from the backend
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param category Filter by category (optional)
 * @returns Promise with the fetched prompts
 */
export const fetchPublicPrompts = async (
  page: number = 1,
  limit: number = 10,
  category?: string
): Promise<FetchPromptsResponse> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/public/prompts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch prompts');
    }

    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error fetching prompts:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'An error occurred while fetching prompts';
    return { 
      success: false, 
      error: errorMessage
    };
  }
};
