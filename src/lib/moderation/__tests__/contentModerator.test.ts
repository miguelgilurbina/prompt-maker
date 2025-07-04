import { ContentModerator } from '../contentModerator';

describe('Content Moderator', () => {
  const testPrompt = {
    title: 'Test Prompt',
    description: 'A test prompt',
    content: 'This is a clean test prompt',
    tags: ['test', 'example']
  };

  it('should approve clean content', async () => {
    const result = await ContentModerator.moderatePrompt(testPrompt);
    expect(result.isApproved).toBe(true);
    expect(result.score).toBe(0);
  });

  it('should detect banned words', async () => {
    const result = await ContentModerator.moderatePrompt({
      ...testPrompt,
      title: 'This contains a banned word: hate'
    });
    expect(result.isApproved).toBe(false);
    expect(result.reasons).toContain('Contains blocked terms: hate');
    expect(result.score).toBeGreaterThan(0.5);
  });

  it('should detect suspicious patterns', async () => {
    const tests = [
      { content: 'Check out http://example.com', type: 'URL' },
      { content: 'Email me at test@example.com', type: 'email' },
      { content: 'My card is 1234-5678-9012-3456', type: 'credit card' },
      { content: 'SSN: 123-45-6789', type: 'SSN' }
    ];

    for (const test of tests) {
      const result = await ContentModerator.moderateContent(test.content);
      expect(result.isApproved).toBe(false);
      expect(result.reasons.some(r => r.includes('suspicious pattern'))).toBe(true);
    }
  });

  it('should reject content that is too short', async () => {
    const result = await ContentModerator.moderateContent('too short');
    expect(result.isApproved).toBe(false);
    expect(result.reasons).toContain('Content length is outside acceptable range');
  });

  it('should reject content that is too long', async () => {
    const longContent = 'a'.repeat(10001);
    const result = await ContentModerator.moderateContent(longContent);
    expect(result.isApproved).toBe(false);
    expect(result.reasons).toContain('Content length is outside acceptable range');
  });

  it('should detect excessive capitalization', async () => {
    const result = await ContentModerator.moderateContent('THIS IS SHOUTING AND SHOULD BE FLAGGED');
    expect(result.isApproved).toBe(false);
    expect(result.reasons).toContain('Excessive use of capital letters');
  });

  it('should combine scores from multiple violations', async () => {
    const result = await ContentModerator.moderatePrompt({
      ...testPrompt,
      title: 'BAD TITLE WITH BANNED WORD',
      content: 'http://example.com and some other content',
      description: 'a'.repeat(10001)
    });
    
    expect(result.isApproved).toBe(false);
    expect(result.score).toBeGreaterThan(1.0);
    expect(result.reasons.length).toBeGreaterThan(1);
  });
});
