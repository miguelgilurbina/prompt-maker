// src/app/explore/page.tsx - Versión con debugging
"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/prompts/SearchBar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { Button } from "@/components/ui/button";
import {
  fetchPublicPrompts,
  voteForPrompt,
  addCommentToPrompt,
  fetchPromptById,
} from "@/lib/services/api";
import { Prompt } from "@/lib/types/prompt.types";

// Componente temporal para debugging
const DebugPanel = ({ data }: { data: unknown }) => {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-black/80 text-white p-4 rounded-lg text-xs font-mono">
      <div className="mb-2 font-bold">🔍 Debug Info</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debugInfo, setDebugInfo] = useState<unknown>({});

  const loadPrompts = async (query = "", page = 1) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      console.log("📡 Fetching prompts with:", { query, page });
      const result = await fetchPublicPrompts(page, 10, query);

      const debugData = {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        requestTime: `${Date.now() - startTime}ms`,
        promptsCount: result.prompts.length,
        totalPages: result.pagination.pages,
        currentPage: page,
        searchQuery: query,
      };

      setDebugInfo(debugData);
      console.log("✅ Prompts loaded:", debugData);

      setPrompts(result.prompts);
      setTotalPages(result.pagination.pages);
    } catch (error) {
      const errorInfo = {
        error: error instanceof Error ? error.message : "Unknown error",
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        timestamp: new Date().toISOString(),
      };

      setDebugInfo(errorInfo);
      console.error("❌ Error loading prompts:", error);
      console.error("Error details:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts(searchQuery, page);
  }, [page, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleVote = async (promptId: string) => {
    try {
      console.log("👍 Voting for prompt:", promptId);
      await voteForPrompt(promptId);

      setPrompts(
        prompts.map((p) =>
          p.id === promptId ? { ...p, votes: (p.votes || 0) + 1 } : p
        )
      );

      console.log("✅ Vote successful");
    } catch (error) {
      console.error("❌ Error voting for prompt:", error);
    }
  };

  const handleAddComment = async (
    promptId: string,
    text: string,
    authorName: string
  ) => {
    try {
      console.log("💬 Adding comment to prompt:", {
        promptId,
        text,
        authorName,
      });
      await addCommentToPrompt(promptId, text, authorName);

      const updatedPrompt = await fetchPromptById(promptId);
      setPrompts(prompts.map((p) => (p.id === promptId ? updatedPrompt : p)));

      console.log("✅ Comment added successfully");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Prompts</h1>

      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          platforms={["OpenAI", "Anthropic", "Midjourney", "All"]}
          types={["Text", "Image", "Code", "All"]}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span>Loading prompts...</span>
          </div>
        </div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onVote={handleVote}
              onAddComment={handleAddComment}
            />
          ))}

          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="py-2 px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No prompts found.</p>
          <p className="mt-2">
            Try a different search or be the first to create a prompt!
          </p>
        </div>
      )}

      <DebugPanel data={debugInfo} />
    </div>
  );
}
