// src/app/page.tsx
"use client";

import { useState } from "react";
import { PromptBuilder } from "@/components/prompts/PromptBuilder";
import { ExplorePanel } from "@/components/prompts/ExplorePanel";
import { Prompt } from "@/lib/types/database.types";
import { PromptFormData } from "@/lib/types/prompt.types";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { savePrompt } from "@/lib/services/promptService";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const router = useRouter();

  const handleSavePrompt = async (
    promptData: Omit<PromptFormData, "authorName">
  ): Promise<void> => {
    console.group("handleSavePrompt");
    console.log("Initial prompt data:", promptData);
    setIsSaving(true);
    setSaveError(null);

    try {
      const saveData = {
        prompt: {
          ...promptData,
          description: promptData.description || null,
          // variables: promptData.variables || null,
        },
        isPublic: promptData.isPublic,
      };

      console.log(
        "Sending save request with data:",
        JSON.stringify(saveData, null, 2)
      );

      // Log the start of the save operation
      console.log("Calling savePrompt...");
      const startTime = performance.now();

      const result = await savePrompt(saveData);
      const endTime = performance.now();
      console.log(`Save operation took ${(endTime - startTime).toFixed(2)}ms`);
      console.log("Save result:", result);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your prompt has been saved successfully.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // If saved as public, navigate to explore page
                if (promptData.isPublic) {
                  router.push("/explore");
                }
              }}
            >
              {promptData.isPublic ? "View in Explore" : "OK"}
            </Button>
          ),
        });

        // Clear the form after successful save
        setSelectedPrompt(null);
      } else {
        throw new Error(result.error || "Failed to save prompt");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving the prompt";
      console.error("Error saving prompt:", error);
      setSaveError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.groupEnd();
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6"></div>
      <div className="flex flex-grow overflow-hidden">
        {/* Prompt Builder - Takes remaining space */}
        <div className="flex-grow h-full ml-2 relative">
          {isSaving && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2 bg-background p-6 rounded-lg shadow-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Saving your prompt...
                </p>
              </div>
            </div>
          )}

          <PromptBuilder
            key={selectedPrompt?.id || "new-prompt"}
            initialPrompt={selectedPrompt || undefined}
            onSave={handleSavePrompt}
            onCancel={() => setSelectedPrompt(null)}
            isSaving={isSaving}
          />

          {saveError && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{saveError}</p>
            </div>
          )}

          {/* Explore Section */}
          <div className="mt-6">
            <ExplorePanel />
          </div>
        </div>
      </div>
    </main>
  );
}
