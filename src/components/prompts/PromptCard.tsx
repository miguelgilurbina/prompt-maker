// src/components/prompts/PromptCard.tsx
import { useTheme } from "@/components/themes/ThemeProvider";
import { type PromptCardProps } from "@/lib/types/prompt";

export function PromptCard({
  prompt: {
    prompt: { title, content, tags },
  },
}: PromptCardProps) {
  const { theme } = useTheme();

  return (
    <div className="japanese-card">
      <h3
        className="text-lg font-medium mb-4"
        style={{ fontFamily: theme.fonts.sans }}
      >
        {title}
      </h3>
      <pre
        className="bg-gray-50 p-4 rounded"
        style={{ fontFamily: theme.fonts.mono }}
      >
        {content}
      </pre>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          {tags?.map((tag) => (
            <span key={tag} className="text-xs text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
        <button className="japanese-button">Copy Prompt</button>
      </div>
    </div>
  );
}
