import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: "success",
      userCount,
      database: "Connected successfully"
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        status: "error",
        error: "Database connection failed",
        details: process.env.NODE_ENV === 'development' ? error.message : {}
      },
      { status: 500 }
    )
  }
}
