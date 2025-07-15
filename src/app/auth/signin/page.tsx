"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    console.log("Attempting sign in with email:", email);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : result.error
        );
      } else if (result?.url) {
        console.log("Sign in successful, redirecting to:", result.url);
        // Use replace instead of push to prevent going back to sign-in page
        window.location.href = result.url;
      } else {
        console.error("Unexpected sign in result:", result);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An error occurred during sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and password to continue
          </p>
        </div>
        {error && (
          <div
            className="bg-destructive/15 text-destructive p-3 rounded-md text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-medium  hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="py-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/signup"
                className="hover:text-primary underline underline-offset-4"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
