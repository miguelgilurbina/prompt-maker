// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { type Prompt as BasePrompt } from "@shared/types/prompt.types";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Extend the base Prompt type to include MongoDB _id
interface MongoPrompt extends Omit<BasePrompt, 'id'> {
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
  return (prompt as MongoPrompt)._id || prompt.id || '';
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
    e.preventDefault();
    e.stopPropagation();
    onView?.(prompt);
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
    <div className={cn(
      "group relative bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md hover:border-primary/20",
      "flex flex-col h-full",
      className
    )}>
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with title and view button */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {prompt.title || 'Untitled Prompt'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0 ml-2"
            onClick={handleView}
            title="View prompt"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
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
        
        {/* Preview content */}
        <div className="text-xs text-muted-foreground line-clamp-3 mt-1 mb-3 flex-1">
          {prompt.content || 'No content available'}
        </div>
        
        {/* Footer with stats - Grouped in bottom left */}
        <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={handleVote}
              disabled={isVoting || hasVoted}
              title="Like"
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-foreground' : ''}`} />
            </Button>
            <span className="min-w-[20px] text-center">{prompt.votes || 0}</span>
          
            <div className="w-px h-4 bg-border/50 mx-1"></div>
            
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="ml-1">{prompt.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
