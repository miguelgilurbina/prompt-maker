// src/app/explore/page.tsx
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
import { Prompt } from "@shared/types/prompt.types";

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const loadPrompts = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const result = await fetchPublicPrompts(page, 10, query);
      setPrompts(result.prompts);
      setTotalPages(result.pagination.pages);
    } catch (error) {
      console.error("Error loading prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts(searchQuery, page);
  }, [page, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };

  const handleVote = async (promptId: string) => {
    try {
      await voteForPrompt(promptId);
      // Actualizar localmente para mejor UX
      setPrompts(
        prompts.map((p) =>
          p.id === promptId ? { ...p, votes: (p.votes || 0) + 1 } : p
        )
      );
    } catch (error) {
      console.error("Error voting for prompt:", error);
    }
  };

  const handleAddComment = async (
    promptId: string,
    text: string,
    authorName: string
  ) => {
    try {
      await addCommentToPrompt(promptId, text, authorName);
      // Actualizar el prompt específico para mostrar el nuevo comentario
      const updatedPrompt = await fetchPromptById(promptId);
      setPrompts(prompts.map((p) => (p.id === promptId ? updatedPrompt : p)));
    } catch (error) {
      console.error("Error adding comment:", error);
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
        <div className="text-center py-12">Loading prompts...</div>
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
    </div>
  );
}
