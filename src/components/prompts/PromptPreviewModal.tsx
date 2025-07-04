// src/components/prompts/PromptPreviewModal.tsx
"use client";

import { useState, useCallback } from "react";
import { X, Copy, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import type { UIPrompt, User } from "@/lib/types";

interface PromptPreviewModalProps {
  /** The prompt to display in the modal */
  prompt: UIPrompt | null;
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when the user votes for a prompt */
  onVote?: (promptId: string) => Promise<void>;
  /** Callback when a new comment is added */
  onAddComment?: (
    promptId: string,
    text: string,
    authorName: string
  ) => Promise<void>;
  /** Optional class name for the root element */
  className?: string;
}

export function PromptPreviewModal({
  prompt,
  open,
  onOpenChange,
  onVote = async () => {},
  onAddComment = async () => {},
}: PromptPreviewModalProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const getAuthorName = useCallback(
    (
      authorInfo?: Pick<User, "id" | "name" | "email" | "image"> | null,
      authorName?: string | null
    ): string => {
      if (authorInfo?.name) return authorInfo.name;
      if (authorName) return authorName;
      return "Anonymous";
    },
    []
  );



  const voteCount = prompt?.voteCount ?? 0;
  const commentCount = prompt?.commentCount ?? 0;
  const hasVoted = prompt?.hasVoted ?? false;
  const authorName = getAuthorName(prompt?.authorInfo, prompt?.authorName);

  const handleVote = useCallback(async () => {
    if (hasVoted || !prompt?.id) return;

    setIsVoting(true);
    try {
      await onVote?.(prompt.id);
    } catch (error) {
      console.error("Error voting for prompt:", error);
    } finally {
      setIsVoting(false);
    }
  }, [hasVoted, onVote, prompt?.id]);

  const handleAddComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim() || !prompt?.id) return;

      setIsSubmittingComment(true);
      try {
        await onAddComment?.(
          prompt.id,
          commentText,
          commentAuthor || "Anonymous"
        );
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [commentText, commentAuthor, onAddComment, prompt?.id]
  );

  const handleCopyToClipboard = useCallback(() => {
    if (!prompt?.content) return;

    navigator.clipboard
      .writeText(prompt.content)
      .then(() => {
        // Could add a toast notification here
        console.log("Copied to clipboard");
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {prompt.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

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
                variant="ghost"
                size="sm"
                onClick={handleCopyToClipboard}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                <span>Copy</span>
              </Button>
            </div>
            <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {prompt.content}
            </pre>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3 text-muted-foreground hover:text-foreground",
                  hasVoted && "text-foreground"
                )}
                onClick={handleVote}
                disabled={isVoting || hasVoted}
              >
                <ThumbsUp
                  className={cn("h-4 w-4 mr-1.5", hasVoted && "fill-current")}
                />
                <span>{voteCount}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {commentCount} {commentCount === 1 ? "comment" : "comments"}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Add a comment
            </h3>
            <form onSubmit={handleAddComment} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>

            {prompt.comments && prompt.comments.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Comments ({prompt.comments.length})
                </h3>
                <div className="space-y-4">
                  {prompt.comments?.map((comment) => (
                    <div key={comment.id} className="mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {getAuthorName(
                            comment.author
                              ? {
                                  id: comment.author.id,
                                  name: comment.author.name,
                                  email: comment.author.email,
                                  image: comment.author.image,
                                }
                              : null,
                            comment.authorName
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
