// src/lib/types/__tests__/typeSystem.test.ts
// Type system validation tests

import {
  DatabasePrompt as Prompt,
  UIPrompt,
  PromptFormData,
  PromptSearchParams,
  PromptStats,
  isDefined,
  isString,
  isObject,
  isArray,
  assertNever,
  assert,
} from '..';

describe('Type System', () => {
  describe('Type Guards', () => {
    test('isDefined should correctly identify defined values', () => {
      expect(isDefined('test')).toBe(true);
      expect(isDefined(0)).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });

    test('isString should correctly identify strings', () => {
      expect(isString('test')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });

    test('isObject should correctly identify objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject('test')).toBe(false);
    });

    test('isArray should correctly identify arrays', () => {
      expect(isArray<unknown>([])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('test')).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });

  describe('Type Assertions', () => {
    test('assert should throw when condition is false', () => {
      expect(() => assert(false, 'Test error')).toThrow('Test error');
      expect(() => assert(true, 'Should not throw')).not.toThrow();
    });

    test('assertNever should throw with the unexpected value', () => {
      const testValue = 'test' as never;
      expect(() => assertNever(testValue)).toThrow('Unexpected object: test');
    });
  });

  describe('Type Compatibility', () => {
    test('Prompt type should have required fields', () => {
      const prompt: Prompt = {
        id: '1',
        title: 'Test Prompt',
        content: 'Test content',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
        authorName: null,
        isPublic: true,
        category: 'general',
        tags: ['test'],
        description: 'Test description',
        variables: [],
        views: 0,
        author: null,
        comments: [],
        votes: [],
      };
      expect(prompt).toBeDefined();
    });

    test('UIPrompt should extend Prompt with additional UI fields', () => {
      const prompt: UIPrompt = {
        id: '1',
        title: 'Test Prompt',
        content: 'Test content',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
        authorName: null,
        authorInfo: null,
        isPublic: true,
        category: 'general',
        tags: ['test'],
        description: 'Test description',
        variables: [],
        comments: [],
        votes: [],
        views: 0,
        // Optional UI properties
        isOwner: false,
        hasVoted: false,
        voteCount: 0,
        commentCount: 0,
      };
      expect(prompt).toBeDefined();
    });
  });

  describe('PromptFormData', () => {
    test('should match expected shape', () => {
      const formData: PromptFormData = {
        id: '1',
        title: 'Test',
        description: 'Test description',
        content: 'Test content',
        category: 'general',
        tags: ['test'],
        isPublic: true,
        variables: [],
        authorName: 'Test User',
        authorId: 'user-123'
      };
      expect(formData).toBeDefined();
    });
  });

  describe('PromptSearchParams', () => {
    test('should allow partial search parameters', () => {
      const search: PromptSearchParams = {
        query: 'test',
        category: 'general',
        tags: ['tag1', 'tag2'],
        sortBy: 'popular',
        page: 1,
        limit: 10
      };
      expect(search).toBeDefined();
    });
  });

  describe('PromptStats', () => {
    test('should include all statistics fields', () => {
      const stats: PromptStats = {
        viewCount: 100,
        likeCount: 10,
        commentCount: 5,
        downloadCount: 3,
        averageRating: 4.5,
        ratingCount: 20,
        lastUpdated: new Date(),
        lastViewed: new Date()
      };
      expect(stats).toBeDefined();
    });
  });
});
