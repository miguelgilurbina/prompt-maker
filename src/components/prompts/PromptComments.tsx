// src/components/prompts/PromptComments.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Comment, User } from "@/lib/types";

interface PromptCommentsProps {
  /** Array of comments to display */
  comments: Array<Comment & {
    author: string | Pick<User, 'id' | 'name' | 'email' | 'image'>;
  }>;
  /** ID of the prompt these comments belong to */
  promptId: string;
  /** Callback when a new comment is added */
  onAddComment: (
    promptId: string,
    text: string,
    authorName: string
  ) => Promise<void>;
  /** Optional class name for the root element */
  className?: string;
}

export function PromptComments({
  comments,
  promptId,
  onAddComment,
  className,
}: PromptCommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(promptId, commentText, authorName || "Anónimo");
      setCommentText("");
      setAuthorName("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthorName = (author: string | Pick<User, 'id' | 'name' | 'email' | 'image'>): string => {
    if (!author) return 'Anonymous';
    return typeof author === 'string' ? author : author.name || 'Anonymous';
  };

  return (
    <div className={className || "mt-6 space-y-4"}>
      <h3 className="text-lg font-medium text-foreground">
        Comments ({comments?.length || 0})
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="bg-muted/30 p-4 rounded-lg border border-border transition-colors hover:bg-muted/50"
            >
              <div key={comment.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {getAuthorName(comment.author)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No comments yet. Be the first to comment!
        </p>
      )}

      {promptId && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] bg-background"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-background flex-1"
            />
            <Button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Sending..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
