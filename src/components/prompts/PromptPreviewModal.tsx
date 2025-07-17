// src/components/prompts/PromptPreviewModal.tsx
"use client";

import { useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { UIPrompt } from "@/lib/types";

interface PromptPreviewModalProps {
  /** The prompt to display in the modal */
  prompt: UIPrompt | null;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
  /** Optional class name for the root element */
  className?: string;
}

export function PromptPreviewModal({
  prompt,
  open,
  onOpenChange,
}: PromptPreviewModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const authorName = prompt?.authorInfo?.name || "Anonymous";

  const handleCopyToClipboard = useCallback(() => {
    if (!prompt?.content) return;

    navigator.clipboard
      .writeText(prompt.content)
      .then(() => {
        setIsCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }, [prompt?.content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {!prompt ? (
          <div className="p-4 text-center text-muted-foreground">
            No prompt selected
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {prompt.title || "Untitled Prompt"}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                <span>• By {authorName}</span>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {prompt.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="text-foreground">{prompt.description}</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Prompt
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    className="mt-4 w-full sm:w-auto justify-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                  {prompt.content}
                </pre>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
