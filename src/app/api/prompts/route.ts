import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Obtener sesión correctamente tipada
    const session = await getServerSession(authOptions) as Session & {
      user: {
        id: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
      };
    };
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || undefined;
    
    const skip = (page - 1) * limit;
    
    // Construir where clause con tipos correctos
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
