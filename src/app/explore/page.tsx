// src/app/explore/page.tsx - Versión con debugging
"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/prompts/SearchBar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptPreviewModal } from "@/components/prompts/PromptPreviewModal";
import { Button } from "@/components/ui/button";
import {
  fetchPublicPrompts,
  voteForPrompt,
  addCommentToPrompt,
  fetchPromptById,
} from "@/lib/services/api";
import { Prompt as BasePrompt } from "@shared/types/prompt.types";

// Extend the base Prompt type to include MongoDB _id
interface MongoPrompt extends Omit<BasePrompt, 'id'> {
  _id: string;
  id?: string; // Make id optional since MongoDB uses _id
}

type PromptWithId = BasePrompt | MongoPrompt;


export default function ExplorePage() {
  const [prompts, setPrompts] = useState<PromptWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithId | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadPrompts = async (query = "", page = 1) => {
    setLoading(true);

    try {
      console.log("📡 Fetching prompts with:", { query, page });
      const result = await fetchPublicPrompts(page, 10, query);

      console.log("✅ Prompts loaded");

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

  // Helper function to get the prompt ID, checking both _id and id fields
  const getPromptId = (p: PromptWithId): string => {
    return '_id' in p ? p._id : p.id || '';
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
      
      // Add the comment
      await addCommentToPrompt(promptId, text, authorName);
      
      // Fetch the updated prompt with the new comment
      const updatedPrompt = await fetchPromptById(promptId);
      
      // Update the state with the new prompt data
      setPrompts(prevPrompts => 
        prevPrompts.map(p => 
          getPromptId(p) === promptId ? updatedPrompt as PromptWithId : p
        )
      );

      console.log("✅ Comment added successfully");
      console.log("Updated prompt:", updatedPrompt);
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const handleView = (prompt: PromptWithId) => {
    setSelectedPrompt(prompt);
    setIsPreviewOpen(true);
  };

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Explore Prompts
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Discover and explore a collection of community-shared prompts for various AI models and use cases.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <SearchBar
          onSearch={handleSearch}
          platforms={["OpenAI", "Anthropic", "Midjourney", "DALL-E", "All"]}
          types={["Text", "Image", "Code", "Audio", "All"]}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
            <span>Loading prompts...</span>
          </div>
        </div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => {
            const promptId = getPromptId(prompt);
            return (
              <PromptCard
                key={promptId}
                prompt={prompt}
                onVote={handleVote}
                onView={handleView}
              />
            );
          })}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1.5 px-4 py-1.5 h-9 min-w-[7rem] border-border/50 hover:bg-accent/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Previous</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current
                  let pageNum;
                  if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={`h-9 w-9 p-0 ${page === pageNum ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50'}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="gap-1.5 px-4 py-1.5 h-9 min-w-[7rem] border-border/50 hover:bg-accent/50"
              >
                <span>Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              {prompts.length} prompts found
            </div>
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

      <PromptPreviewModal
        prompt={selectedPrompt}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
