// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { type Prompt as BasePrompt } from "@shared/types/prompt.types";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Extend the base Prompt type to include MongoDB _id
interface MongoPrompt extends Omit<BasePrompt, "id"> {
  _id: string;
  id?: string; // Make id optional since MongoDB uses _id
}

export interface PromptCardProps {
  prompt: MongoPrompt | BasePrompt;
  onVote?: (promptId: string) => Promise<void>;
  onView?: (prompt: MongoPrompt | BasePrompt) => void;
  className?: string;
}

// Helper function to get the prompt ID, checking both _id and id fields
const getPromptId = (prompt: MongoPrompt | BasePrompt): string => {
  return (prompt as MongoPrompt)._id || prompt.id || "";
};

export function PromptCard({
  prompt,
  onVote = async () => {},
  onView,
  className = "",
}: PromptCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    // Only trigger view if the click is on the card itself, not on interactive elements
    if (!(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      e.stopPropagation();
      onView?.(prompt);
    }
  };

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const promptId = getPromptId(prompt);
    if (hasVoted || !promptId) {
      return;
    }

    setIsVoting(true);

    try {
      await onVote(promptId);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting for prompt:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md hover:border-primary/20 cursor-pointer",
        "flex flex-col h-full",
        className
      )}
      onClick={handleView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView?.(prompt);
        }
      }}
    >
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with title and view button */}
        <div className="mb-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-1 leading-tight">
            {prompt.title || "Untitled Prompt"}
          </h3>
        </div>

        {/* Tags */}
        {prompt.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {prompt.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {prompt.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{prompt.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {prompt.description && (
          <div className="text-xs text-muted-foreground line-clamp-3 mt-1 mb-3 flex-1">
            {prompt.description}
          </div>
        )}

        {/* Footer with stats - Grouped in bottom left */}
        <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button
              type="button"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleVote(e);
              }}
              disabled={isVoting || hasVoted}
              title="Like"
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${hasVoted ? "fill-foreground" : ""}`}
              />
            </button>
            <span className="min-w-[20px] text-center">
              {prompt.votes || 0}
            </span>

            <div className="w-px h-4 bg-border/50 mx-1"></div>

            <MessageCircle className="h-3.5 w-3.5" />
            <span className="ml-1">{prompt.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
