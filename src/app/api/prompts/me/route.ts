import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';



// Define the shape of a comment
interface CommentResponse {
  id: string;
  author: string;
  authorName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}


// Define the shape of the response data
interface PromptResponse {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  comments: CommentResponse[];
  votes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  prompts: PromptResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse | { error: string }>> {
  try {
    console.log('=== GET /api/prompts/me ===');
    console.log('Request URL:', request.url);
    
    // Get the current session
    console.log('Calling getServerSession...');
    const session = await getServerSession(authOptions);
    console.log('Session from getServerSession:', session ? 'Session exists' : 'No session');
    
    // If no session or user email, return unauthorized
    if (!session?.user?.email) {
      console.log('No session or user email found, returning 401');
      console.log('Session object:', JSON.stringify(session, null, 2));
      return NextResponse.json(
        { error: 'Unauthorized' } as const,
        { status: 401 }
      );
    }
    
    console.log('User email from session:', session.user.email);
    
    // Parse query parameters with defaults
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const search = searchParams.get('search') ?? '';
    const category = searchParams.get('category') ?? undefined;
    const sortBy = (searchParams.get('sortBy') as 'newest' | 'popular') || 'newest';
    
    console.log('Query parameters:', { page, limit, search, category, sortBy });
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build the where clause for the query
    const where: Prisma.PromptWhereInput = {
      author: { email: session.user.email },
      isPublic: true, // Only return public prompts for now
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
    };
    
    console.log('Database query where clause:', JSON.stringify(where, null, 2));
    
    try {
      // Get total count for pagination
      const total = await prisma.prompt.count({ where });
      console.log(`Found ${total} total prompts matching query`);
      
      // Get paginated prompts
      console.log(`Fetching prompts (skip: ${skip}, take: ${limit}, sortBy: ${sortBy})`);
      const prompts = await prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Simplified for now, can add popular sorting later
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
      
      console.log(`Fetched ${prompts.length} prompts`);
      
      // Transform the prompts to match the expected response format
      const formattedPrompts: PromptResponse[] = prompts.map(prompt => {
        const author = prompt.author || { id: '', name: 'Unknown', email: null, image: null };
        
        return {
          id: prompt.id,
          _id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          tags: prompt.tags || [],
          isPublic: prompt.isPublic,
          author: {
            id: author.id,
            name: author.name || 'Unknown',
            email: author.email,
            image: author.image
          },
          comments: [], // Empty comments array for now
          votes: 0, // Default votes to 0
          commentCount: 0, // Default comment count to 0
          createdAt: prompt.createdAt.toISOString(),
          updatedAt: prompt.updatedAt.toISOString()
        };
      });
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      
      // Log pagination info
      console.log('Pagination info:', {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      });
      
      // Return the response
      const response: PaginatedResponse = {
        prompts: formattedPrompts,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasNextPage,
          hasPrevPage: hasPreviousPage
        }
      };
      
      console.log('Returning response with', formattedPrompts.length, 'prompts');
      return NextResponse.json(response);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user prompts' },
      { status: 500 }
    );
  }
}
