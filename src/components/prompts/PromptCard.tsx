// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { User, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { formatDistanceToNow } from "date-fns";
import type { UIPrompt } from "@/lib/types/database.types";
import { toast } from "sonner";

interface PromptCardProps {
  /** The prompt data to display */
  prompt: UIPrompt;
  /** Callback when the card is clicked to view the prompt */
  onView: (prompt: UIPrompt) => void;
  /** Callback when the delete button is clicked */
  onDelete?: (promptId: string) => Promise<void>;
  /** Whether the current user is the owner of this prompt */
  isOwner?: boolean;
  /** Optional class name for the root element */
  className?: string;
}

export function PromptCard({
  prompt,
  isOwner = false,
  onDelete,
  onView,
  className,
}: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    // Only trigger view if the click is on the card itself, not on interactive elements
    if (!(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      e.stopPropagation();
      onView?.(prompt);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!prompt.id || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(prompt.id);
      toast.success("Prompt deleted successfully");
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formattedDate = formatDistanceToNow(
    typeof prompt.createdAt === "string"
      ? new Date(prompt.createdAt)
      : prompt.createdAt,
    { addSuffix: true }
  );

  const getAuthorName = (): string => {
    if (prompt.authorInfo?.name) return prompt.authorInfo.name;
    if (prompt.authorInfo?.email) return prompt.authorInfo.email.split("@")[0];
    return "Anonymous";
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
      {/* Delete button for owner */}
      {isOwner && onDelete && (
        <button
          type="button"
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/50 z-10"
          disabled={isDeleting}
          aria-label="Delete prompt"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Header with title and owner badge */}
        <div className="flex justify-between items-start mb-2 pr-6">
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
          <span className="truncate">{getAuthorName()}</span>
          <span className="mx-1">•</span>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Description */}
        {prompt.description && (
          <div className="text-xs text-muted-foreground line-clamp-3 mt-1 mb-3 flex-1">
            {prompt.description}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Prompt</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this prompt? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmDelete();
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
