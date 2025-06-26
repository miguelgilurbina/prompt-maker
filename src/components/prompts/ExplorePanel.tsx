// src/components/prompts/ExplorePanel.tsx
"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/prompts/SearchBar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptPreviewModal } from "@/components/prompts/PromptPreviewModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  fetchPublicPrompts,
  voteForPrompt,
  addCommentToPrompt,
  fetchPromptById,
} from "@/lib/services/api";
import { Prompt as BasePrompt } from "@shared/types/prompt.types";

// Extend the base Prompt type to include MongoDB _id
interface MongoPrompt extends Omit<BasePrompt, "id"> {
  _id: string;
}

type PromptWithId = BasePrompt | MongoPrompt;

export function ExplorePanel() {
  const [prompts, setPrompts] = useState<PromptWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithId | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadPrompts = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const result = await fetchPublicPrompts(page, 10, query);
      setPrompts(result.prompts);
      setTotalPages(result.pagination.pages);
    } catch (error) {
      console.error("❌ Error loading prompts:", error);
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
      await voteForPrompt(promptId);
      setPrompts(
        prompts.map((p) =>
          getPromptId(p) === promptId ? { ...p, votes: (p.votes || 0) + 1 } : p
        )
      );
    } catch (error) {
      console.error("❌ Error voting for prompt:", error);
    }
  };

  const handleAddComment = async (
    promptId: string,
    comment: string,
    author: string
  ) => {
    try {
      await addCommentToPrompt(promptId, comment, author);
      const updatedPrompt = await fetchPromptById(promptId);
      setPrompts((prevPrompts) =>
        prevPrompts.map((p) =>
          getPromptId(p) === promptId ? (updatedPrompt as PromptWithId) : p
        )
      );
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const handleOpenPreview = (prompt: PromptWithId) => {
    setSelectedPrompt(prompt);
    setIsPreviewOpen(true);
  };

  const getPromptId = (p: PromptWithId): string => {
    return (p as MongoPrompt)._id || (p as BasePrompt).id || "";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto flex flex-col h-full" data-testid="explore-panel">
      <CardHeader className="pb-4">
        <CardTitle>Explore Prompts</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <SearchBar onSearch={handleSearch} className="mb-6" />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No prompts found. Try a different search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={getPromptId(prompt)}
                prompt={prompt}
                onVote={handleVote}
                onView={handleOpenPreview}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {selectedPrompt && (
        <PromptPreviewModal
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          prompt={selectedPrompt}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      )}
      </CardContent>
    </Card>
  );
}
