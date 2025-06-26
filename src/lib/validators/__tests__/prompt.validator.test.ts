import { validatePrompt } from '../prompt.validator';

describe('Prompt Validation', () => {
  interface TestPrompt {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    votes: number;
    comments: unknown[];
    isPublic?: boolean;
  }

  let validPrompt: TestPrompt;

  beforeEach(() => {
    validPrompt = {
      title: 'Test Prompt',
      description: 'A test prompt',
      content: 'This is a test prompt with enough content',
      category: 'technical',
      tags: ['test', 'example'],
      votes: 0,
      comments: []
    };
  });

  it('should validate a correct prompt', () => {
    const result = validatePrompt(validPrompt);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = validatePrompt({ ...validPrompt, title: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path[0] === 'title')).toBe(true);
  });

  it('should reject title that is too long', () => {
    const longTitle = 'a'.repeat(101);
    const result = validatePrompt({ ...validPrompt, title: longTitle });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => 
      i.path[0] === 'title' && i.message.includes('exceed 100 characters')
    )).toBe(true);
  });

  it('should reject empty content', () => {
    const result = validatePrompt({ ...validPrompt, content: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path[0] === 'content')).toBe(true);
  });

  it('should reject content that is too short', () => {
    const result = validatePrompt({ ...validPrompt, content: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const result = validatePrompt({ ...validPrompt, category: 'INVALID_CATEGORY' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path[0] === 'category')).toBe(true);
  });

  it('should reject too many tags', () => {
    const tags = Array(6).fill('tag');
    const result = validatePrompt({ ...validPrompt, tags });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => 
      i.path[0] === 'tags' && i.message.includes('more than 5')
    )).toBe(true);
  });

  it('should reject tags that are too long', () => {
    const longTag = 'a'.repeat(21);
    const result = validatePrompt({ ...validPrompt, tags: [longTag] });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => 
      i.path[0] === 'tags' && i.message.includes('exceed 20 characters')
    )).toBe(true);
  });

  it('should make isPublic optional and default to true', () => {
    const { isPublic, ...promptWithoutPublic } = validPrompt;
    const result = validatePrompt(promptWithoutPublic);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublic).toBe(true);
    }
  });
});
