import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || undefined;
    
    const skip = (page - 1) * limit;
    
    // Build the where clause for public prompts
    const where: Prisma.PromptWhereInput = {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
    };
    
    // Execute queries in a transaction
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
    
    return NextResponse.json({
      data: prompts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
    
  } catch (error) {
    console.error('Error fetching public prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public prompts' },
      { status: 500 }
    );
  }
}
