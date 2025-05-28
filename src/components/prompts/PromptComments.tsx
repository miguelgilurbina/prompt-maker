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
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-secondary/20 p-3 rounded-lg">
              <p className="text-sm">{comment.text}</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  By: {comment.authorName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex gap-3">
          <Input
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <Button type="submit" disabled={!commentText.trim() || isSubmitting}>
            {isSubmitting ? "Sending..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
