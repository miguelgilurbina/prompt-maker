// src/components/prompts/PromptPreviewModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X, Copy, ThumbsUp, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prompt as BasePrompt } from "@shared/types/prompt.types";
import { useState } from "react";
import { cn } from "@/lib/utils/utils";

// Extend the base Prompt type to include MongoDB _id
interface MongoPrompt extends Omit<BasePrompt, 'id'> {
  _id: string;
  id?: string; // Make id optional since MongoDB uses _id
}

type PromptWithId = BasePrompt | MongoPrompt;

interface PromptPreviewModalProps {
  prompt: PromptWithId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVote?: (promptId: string) => Promise<void>;
  onAddComment?: (promptId: string, text: string, authorName: string) => Promise<void>;
}

export function PromptPreviewModal({ 
  prompt, 
  open, 
  onOpenChange, 
  onVote = async () => {},
  onAddComment = async () => {}
}: PromptPreviewModalProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Anonymous");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!prompt) return null;

  const handleVote = async () => {
    if (hasVoted || !prompt.id) return;
    
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.id || !commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      await onAddComment(prompt.id, commentText.trim(), commentAuthor || "Anonymous");
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const copyToClipboard = () => {
    if (!prompt.content) return;
    navigator.clipboard.writeText(prompt.content);
    // You might want to add a toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {prompt.title || 'Untitled Prompt'}
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
          </div>
          
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
            {prompt.authorName && <span>• By {prompt.authorName}</span>}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {prompt.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-foreground">{prompt.description}</p>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
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
                <ThumbsUp className={cn("h-4 w-4 mr-1.5", hasVoted && "fill-current")} />
                <span>{prompt.votes || 0}</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {prompt.comments?.length || 0} {prompt.comments?.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Add a comment</h3>
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
                  {isSubmittingComment ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
            
            {prompt.comments?.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Comments ({prompt.comments.length})
                </h3>
                <div className="space-y-4">
                  {prompt.comments.map((comment, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4 py-1">
                      <div className="text-sm font-medium text-foreground">
                        {comment.authorName || 'Anonymous'}
                      </div>
                      <p className="text-sm text-foreground/90">{comment.text}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
