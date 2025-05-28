// frontend/src/components/prompts/VoteButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface VoteButtonProps {
  promptId: string;
  initialVotes: number;
  onVote: (promptId: string) => Promise<void>;
}

export function VoteButton({
  promptId,
  initialVotes,
  onVote,
}: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (hasVoted) return;

    setIsVoting(true);
    try {
      await onVote(promptId);
      setVotes((prev) => prev + 1);
      setHasVoted(true);
      // Opcional: guardar en localStorage que este usuario ya votó
      localStorage.setItem(`voted_${promptId}`, "true");
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleVote}
      disabled={isVoting || hasVoted}
      className="flex items-center gap-1"
    >
      <ThumbsUp className="h-4 w-4" />
      <span>{votes}</span>
    </Button>
  );
}
