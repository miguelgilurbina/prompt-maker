import { NextResponse } from "next/server"
import { tokenStore } from "@/lib/utils/token-storage"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token is required", valid: false },
        { status: 400 }
      )
    }

    // Validate token using our token storage system
    const isValid = tokenStore.isValid(token)

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired token", valid: false },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Token is valid", valid: true },
      { status: 200 }
    )

  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      { error: "An error occurred validating the token", valid: false },
      { status: 500 }
    )
  }
}
