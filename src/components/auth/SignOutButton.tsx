'use client'
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className="text-sm text-gray-700 hover:bg-gray-100"
    >
      Sign out
    </Button>
  )
}
