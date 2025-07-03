// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import type { UIPrompt } from "@/lib/types/database.types";

interface PromptCardProps {
  /** The prompt data to display */
  prompt: UIPrompt;
  /** Callback when the card is clicked to view the prompt */
  onView: (prompt: UIPrompt) => void;
  /** Callback when the vote button is clicked */
  onVote: (promptId: string) => Promise<void>;
  /** Whether the current user is the owner of this prompt */
  isOwner?: boolean;
  /** Whether the current user has already voted for this prompt */
  hasVoted?: boolean;
  /** Optional class name for the root element */
  className?: string;
}

export function PromptCard({
  prompt,
  isOwner = false,
  onVote = async () => {},
  onView,
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

    if (hasVoted || !prompt.id) {
      return;
    }

    setIsVoting(true);

    try {
      await onVote(prompt.id);
      setHasVoted(true);
    } catch (error) {
      console.error("Error voting for prompt:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const voteCount = prompt.votes?.length || 0;
  const commentCount = prompt.comments?.length || 0;

  const formattedDate = formatDistanceToNow(
    typeof prompt.createdAt === "string"
      ? new Date(prompt.createdAt)
      : prompt.createdAt,
    { addSuffix: true }
  );

  const getAuthorName = (): string => {
    return prompt.authorName || 'Anonymous';
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md hover:border-primary/20 cursor-pointer",
        "flex flex-col h-full"
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
        {/* Header with title and owner badge */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-1 leading-tight flex-1">
            {prompt.title || "Untitled Prompt"}
          </h3>
          {isOwner && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Yours
            </span>
          )}
        </div>

        {/* Author and date */}
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <User className="h-3.5 w-3.5 mr-1" />
          <span className="truncate">
            {getAuthorName()}
          </span>
          <span className="mx-1">•</span>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Description */}
        {prompt.description && (
          <div className="text-xs text-muted-foreground line-clamp-3 mt-1 mb-3 flex-1">
            {prompt.description}
          </div>
        )}

        {/* Footer with stats */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button
              type="button"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex items-center justify-center"
              onClick={handleVote}
              disabled={isVoting || hasVoted}
              title="Like"
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${hasVoted ? "fill-foreground" : ""}`}
              />
            </button>
            <span className="min-w-[20px] text-center">{voteCount}</span>

            <div className="w-px h-4 bg-border/50 mx-1"></div>

            <div className="flex items-center">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              <span>{commentCount}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {prompt.views || 0} views
          </div>
        </div>
      </div>
    </div>
  );
}
