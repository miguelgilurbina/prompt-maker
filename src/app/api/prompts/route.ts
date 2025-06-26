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

export async function GET() {
  try {
    // TODO: Fetch prompts from your database
    const prompts: Prompt[] = [];
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
