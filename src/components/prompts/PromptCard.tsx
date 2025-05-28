// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { useTheme } from "@/components/themes/ThemeProvider";
import { type Prompt } from "@/../../shared/src/types/prompt.types";
import { VoteButton } from "./VoteButton";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { PromptComments } from "./PromptComments";

interface PromptCardProps {
  prompt: Prompt;
  onVote?: (promptId: string) => Promise<void>;
  onAddComment?: (
    promptId: string,
    text: string,
    authorName: string
  ) => Promise<void>;
}

export function PromptCard({
  prompt,
  onVote = async () => {},
  onAddComment = async () => {},
}: PromptCardProps) {
  const { theme } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="japanese-card">
      <h3
        className="text-lg font-medium mb-4"
        style={{ fontFamily: theme.fonts.sans }}
      >
        {prompt.title}
      </h3>
      <pre
        className="bg-gray-50 p-4 rounded"
        style={{ fontFamily: theme.fonts.mono }}
      >
        {prompt.content}
      </pre>

      {/* Información del autor y fecha */}
      <div className="mt-3 text-sm text-gray-500">
        <span>By: {prompt.authorName || "Anonymous"}</span>
        <span className="mx-2">•</span>
        <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          {prompt.tags?.map((tag) => (
            <span key={tag} className="text-xs text-gray-500">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Botón de votos */}
          <VoteButton
            promptId={prompt.id}
            initialVotes={prompt.votes || 0}
            onVote={onVote}
          />

          {/* Botón de comentarios */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{prompt.comments?.length || 0}</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Botón de copiar */}
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Sección de comentarios expandible */}
      {showComments && (
        <div className="mt-4">
          <PromptComments
            comments={prompt.comments || []}
            promptId={prompt.id}
            onAddComment={onAddComment}
          />
        </div>
      )}
    </div>
  );
}
