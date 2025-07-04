"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/themes/ThemeThoggle";
import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type NavLink = {
  name: string;
  href: string;
  protected?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { name: "Explore", href: "/explore" },
  { name: "My Prompts", href: "/my-prompts", protected: true },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoading = status === "loading";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="mr-8 flex items-center space-x-2 font-bold"
            onClick={closeMobileMenu}
          >
            <span>Prompt Maker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => {
              if (link.protected && !session) return null;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>
          
          {/* GitHub Link */}
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link
              href="https://github.com/miguelgilurbina/prompt-maker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </Link>
          </Button>

          {/* Auth Buttons - Desktop */}
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  size="sm"
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-t bg-background px-4 py-2 shadow-lg md:hidden">
          <div className="space-y-2 py-2">
            {NAV_LINKS.map((link) => {
              if (link.protected && !session) return null;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t pt-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ) : session ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {session.user?.name || session.user?.email}
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="w-full justify-start px-3"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/auth/signin" onClick={closeMobileMenu}>
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild className="w-full">
                  <Link href="/auth/signup" onClick={closeMobileMenu}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <div className="w-full">
              <ThemeToggle />
            </div>
            <Button variant="ghost" size="icon" asChild className="ml-2">
              <Link
                href="https://github.com/miguelgilurbina/prompt-maker"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
