import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface GetUserPromptsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'popular';
}

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // If no session, return unauthorized
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params: GetUserPromptsParams = {
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sortBy: (searchParams.get('sortBy') as 'newest' | 'popular') || 'newest'
    };

    // TODO: Replace with actual database query
    // This is a mock implementation
    const mockPrompts: any[] = [];
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
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user prompts' },
      { status: 500 }
    );
  }
}
