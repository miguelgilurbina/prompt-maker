"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    console.log("Auth Error:", { error, errorDescription });
  }, [error, errorDescription]);

  const getErrorMessage = () => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally.";
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The sign in link is no longer valid. It may have been used already or it may have expired.";
      default:
        return "An unexpected error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            There was a problem signing you in
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {getErrorMessage()}
            {errorDescription && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Error details: {errorDescription}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full max-w-xs"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading error details...</p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
