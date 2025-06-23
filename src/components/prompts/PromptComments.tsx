// frontend/src/components/prompts/PromptComments.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PromptComment } from "@shared/types/prompt.types";

interface PromptCommentsProps {
  comments: PromptComment[];
  promptId: string;
  onAddComment: (
    promptId: string,
    text: string,
    authorName: string
  ) => Promise<void>;
}

export function PromptComments({
  comments,
  promptId,
  onAddComment,
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

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium text-foreground">
        Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div 
              key={comment.id || index} 
              className="bg-muted/30 p-4 rounded-lg border border-border transition-colors hover:bg-muted/50"
            >
              <p className="text-sm text-foreground/90">{comment.text}</p>
              <div className="flex justify-between mt-3 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  By: <span className="text-foreground/80">{comment.authorName}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
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
