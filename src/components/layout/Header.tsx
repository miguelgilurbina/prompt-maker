"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/themes/ThemeThoggle";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Prompt Maker
          </Link>

          {/* <nav className="hidden md:flex items-center space-x-6"> */}
          {/* <Link href="/explore" className="hover:text-primary">
              Explore Prompts
            </Link> */}
          {/* <Link href="/library" className="hover:text-primary">
              Library
            </Link>
            <Link href="/docs" className="hover:text-primary">
              Docs
            </Link> */}
          {/* </nav> */}

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/miguelgilurbina/prompt-maker"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
