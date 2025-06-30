import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/middleware/rateLimit';
import { validatePrompt } from '@/lib/validators/prompt.validator';
import { ContentModerator } from '@/lib/moderation/contentModerator';
import { Prompt } from '@/lib/types/prompt.types';



// Apply rate limiting (10 requests per minute)
const limiter = rateLimit({
  max: 10,
  window: 60,
  errorMessage: 'Too many requests, please try again later.'
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await limiter(request);
    if (rateLimitResponse.status !== 200) {
      return rateLimitResponse;
    }

    const data = await request.json();
    
    // Validate input
    const validation = validatePrompt(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Moderate content
    const moderationResult = await ContentModerator.moderatePrompt(data);
    if (!moderationResult.isApproved) {
      return NextResponse.json(
        { 
          error: 'Content moderation failed',
          reasons: moderationResult.reasons,
          score: moderationResult.score
        },
        { status: 422 }
      );
    }

    // If we get here, the prompt is valid and approved
    // TODO: Save the prompt to your database
    const savedPrompt = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(savedPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface GetPromptsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'popular';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: GetPromptsParams = {
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sortBy: (searchParams.get('sortBy') as 'newest' | 'popular') || 'newest'
    };

    // TODO: Replace with actual database query
    // This is a mock implementation
    const mockPrompts = [];
    const total = 0;
    
    return NextResponse.json({
      data: mockPrompts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
        hasNextPage: params.page * params.limit < total,
        hasPrevPage: params.page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
