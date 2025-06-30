import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// This is the route handler for NextAuth in the App Router
export async function GET(request: NextRequest) {
  try {
    // Handle the request using NextAuth
    const response = await NextAuth(authOptions).handlers.GET(request);
    return response;
  } catch (error) {
    console.error('Auth API Error (GET):', error);
    return NextResponse.json(
      {
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: (error as Error).stack 
        })
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle the request using NextAuth
    const response = await NextAuth(authOptions).handlers.POST(request);
    return response;
  } catch (error) {
    console.error('Auth API Error (POST):', error);
    return NextResponse.json(
      {
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: (error as Error).stack 
        })
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
