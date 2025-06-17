// src/components/prompts/PromptCard.tsx
import { useState } from "react";
import { useTheme } from "@/components/themes/ThemeProvider";
import { type Prompt } from "@/../../shared/src/types/prompt.types";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, ThumbsUp } from "lucide-react";
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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col transition-shadow duration-300 hover:shadow-xl">
      {/* Card Header */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: theme.fonts.sans }}>
          {prompt.title}
        </h3>
        {prompt.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden text-ellipsis">
            {prompt.description}
          </p>
        )}

        {/* Prompt Content Preview */}
        <pre
          className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto max-h-40"
          style={{ fontFamily: theme.fonts.mono }}
        >
          {prompt.content}
        </pre>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.tags?.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote(prompt.id)}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-500"
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="font-semibold">{prompt.votes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-green-500"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">{prompt.comments?.length || 0}</span>
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Collapsible Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
