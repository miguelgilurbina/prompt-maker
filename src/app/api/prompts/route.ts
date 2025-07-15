import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Define the schema for prompt creation
const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional().nullable(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().default('general'),
  isPublic: z.boolean().default(false),
});

// Helper function to get the authenticated user's session
async function getAuthenticatedSession() {
  const session = await getServerSession(authOptions) as Session & {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  };
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || undefined;
    const isPublic = searchParams.get('isPublic') === 'true' ? true : 
                    searchParams.get('isPublic') === 'false' ? false : undefined;
    
    const skip = (page - 1) * limit;
    
    // Build where clause with correct types
    const where: Prisma.PromptWhereInput = {
      authorId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
      ...(isPublic !== undefined && { isPublic }),
    };
    
    // Ejecutar queries
    const [prompts, total] = await prisma.$transaction([
      prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.prompt.count({ where }),
    ]);
    
    // Devolver el mismo formato que /api/prompts
    return NextResponse.json({
      data: prompts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
    
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession();
    const body = await request.json();
    
    // Validate the request body against the schema
    const validation = createPromptSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { title, description, content, category, isPublic } = validation.data;
    
    // Create the prompt in the database
    const prompt = await prisma.prompt.create({
      data: {
        title,
        description,
        content,
        category,
        isPublic,
        author: {
          connect: { id: session.user.id },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(prompt, { status: 201 });
    
  } catch (error) {
    console.error('Error creating prompt:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'You must be logged in to create a prompt' },
          { status: 401 }
        );
      }
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.format() },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthenticatedSession();
    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('id');

    if (!promptId) {
      return NextResponse.json(
        { error: 'Prompt ID is required' },
        { status: 400 }
      );
    }

    // First, verify the prompt exists and belongs to the user
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { authorId: true }
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Verify the prompt belongs to the current user
    if (prompt.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this prompt' },
        { status: 403 }
      );
    }

    // Delete the prompt and its related records in a transaction
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { promptId } }),
      prisma.vote.deleteMany({ where: { promptId } }),
      prisma.prompt.delete({ where: { id: promptId } })
    ]);

    return NextResponse.json(
      { success: true, message: 'Prompt deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting prompt:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'You must be logged in to delete a prompt' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}
