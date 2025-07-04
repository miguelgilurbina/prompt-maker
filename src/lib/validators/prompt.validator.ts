import { z } from 'zod';

// Define validation rules
// Define valid categories inline for validation

export const promptSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
    
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
    
  content: z.string()
    .min(10, 'Prompt content must be at least 10 characters')
    .max(10000, 'Prompt content cannot exceed 10,000 characters')
    .trim(),
    
  category: z.enum(['creative-writing', 'technical', 'business', 'academic', 'general', 'custom'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  
  tags: z.array(z.string().max(20, 'Tag cannot exceed 20 characters'))
    .max(5, 'Cannot have more than 5 tags')
    .optional(),
    
  isPublic: z.boolean().default(true)
});

export const validatePrompt = (data: unknown) => {
  return promptSchema.safeParse(data);
};

export const sanitizePromptInput = (input: string): string => {
  // Basic XSS prevention - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+=".*?"/g, '');
};
