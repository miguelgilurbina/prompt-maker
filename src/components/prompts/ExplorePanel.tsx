// src/components/prompts/ExplorePanel.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import { Search, Loader2, AlertCircle } from "lucide-react";

// UI Components
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Custom Components
import { PromptCard } from "./PromptCard";
import { PromptPreviewModal } from "./PromptPreviewModal";

// Types
import type { UIPrompt, PromptCategory } from "@/lib/types/database.types";
import type { User, Vote as PrismaVote } from "@prisma/client";

// Define valid prompt categories for the UI
const VALID_CATEGORIES = [
  "general",
  "creative",
  "technical",
  "business",
  "education",
  "other",
] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Type guard to check if an object has a property
const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => {
  return prop in obj;
};

// Local type for API response prompt
interface ApiPrompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string; // This will be cast to PromptCategory
  tags: string[];
  isPublic: boolean;
  authorId: string;
  author?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  votes?: Array<{ userId: string }>; // Simplified for UI purposes
  comments?: Array<{
    id: string;
    content: string;
    authorId: string;
    authorName?: string;
    authorImage?: string | null;
    createdAt: string | Date;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
  variables?: Array<{
    id: string;
    name: string;
    type: string;
    defaultValue?: string;
    required?: boolean;
  }>;
  voteCount?: number;
  commentCount?: number;
  views?: number;
}

// Constants
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 500;

type TabType = "public" | "my-prompts";

// Vote response from API
interface VoteResponse {
  votes: PrismaVote[];
  voteCount: number;
}

/**
 * ExplorePanel Component
 *
 * Displays a list of prompts with filtering, searching, and pagination capabilities.
 * Users can view public prompts or their own prompts when authenticated.
 */
export function ExplorePanel() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<UIPrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("public");
  const [selectedPrompt, setSelectedPrompt] = useState<UIPrompt | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Debounced search with cleanup
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (isMountedRef.current) {
          setSearchQuery(value);
          setPage(1); // Reset page when searching
        }
      }, DEBOUNCE_DELAY),
    []
  );

  // Ensure a valid category value
  const getValidCategory = (category: string): ValidCategory => {
    return VALID_CATEGORIES.includes(category as ValidCategory)
      ? (category as ValidCategory)
      : "general";
  };

  // Process prompt data from API response to match our UIPrompt type
  const processPromptData = useCallback(
    (apiPrompt: ApiPrompt): UIPrompt => {
      try {
        console.log("Processing prompt data:", apiPrompt);

        // Handle different API response structures
        const author = apiPrompt.author || null;
        const votes = apiPrompt.votes || [];
        const comments = apiPrompt.comments || [];
        const voteCount = apiPrompt.voteCount || votes.length || 0;
        const commentCount = apiPrompt.commentCount || comments.length || 0;
        const views = apiPrompt.views || 0;

        // Get a valid category
        const category = getValidCategory(apiPrompt.category) as PromptCategory;

        // Helper function to safely get author info from comment
        const getCommentAuthorInfo = (comment: unknown) => {
          if (typeof comment !== "object" || comment === null) {
            return {
              name: "Anonymous",
              image: null,
              id: "",
              author: null,
            };
          }

          return {
            name:
              hasProperty(comment, "author") &&
              comment.author &&
              typeof comment.author === "object" &&
              hasProperty(comment.author, "name")
                ? String(comment.author.name) || "Anonymous"
                : hasProperty(comment, "authorName")
                ? String(comment.authorName) || "Anonymous"
                : "Anonymous",
            image:
              hasProperty(comment, "author") &&
              comment.author &&
              typeof comment.author === "object" &&
              hasProperty(comment.author, "image")
                ? (comment.author.image as string | null)
                : hasProperty(comment, "authorImage")
                ? (comment.authorImage as string | null)
                : null,
            id: hasProperty(comment, "authorId")
              ? String(comment.authorId)
              : hasProperty(comment, "author") &&
                comment.author &&
                typeof comment.author === "object" &&
                hasProperty(comment.author, "id")
              ? String(comment.author.id)
              : "",
            author: hasProperty(comment, "author")
              ? (comment.author as User | null)
              : null,
          };
        };

        // Helper function to safely get vote info
        const getVoteInfo = (vote: unknown) => {
          if (typeof vote !== "object" || vote === null) {
            return {
              id: `temp-${Math.random().toString(36).substr(2, 9)}`,
              userId: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              user: null,
            };
          }

          const createdAt = hasProperty(vote, "createdAt")
            ? new Date(String(vote.createdAt))
            : new Date();

          return {
            id: hasProperty(vote, "id")
              ? String(vote.id)
              : `temp-${Math.random().toString(36).substr(2, 9)}`,
            userId: hasProperty(vote, "userId") ? String(vote.userId) : "",
            createdAt,
            updatedAt: hasProperty(vote, "updatedAt")
              ? new Date(String(vote.updatedAt))
              : createdAt,
            user: hasProperty(vote, "user") ? (vote.user as User | null) : null,
          };
        };

        // Create UIPrompt with proper type safety
        const uiPrompt: UIPrompt = {
          id: apiPrompt.id,
          title: apiPrompt.title,
          description: apiPrompt.description || null,
          content: apiPrompt.content,
          category,
          // tags: Array.isArray(apiPrompt.tags) ? apiPrompt.tags : [], // Removed as not part of UIPrompt type
          isPublic: !!apiPrompt.isPublic,
          authorId: apiPrompt.authorId,
          // authorName: author?.name || "Anonymous", // Removed as not part of UIPrompt type
          createdAt: new Date(apiPrompt.createdAt || Date.now()),
          updatedAt: new Date(apiPrompt.updatedAt || Date.now()),
          // variables: (Array.isArray(apiPrompt.variables) ? apiPrompt.variables : []).map(...), // Removed as not part of UIPrompt type
          isOwner: session?.user?.id === apiPrompt.authorId,
          hasVoted:
            votes.some((vote) => {
              const voteData = vote as { userId?: unknown };
              return (
                hasProperty(voteData, "userId") &&
                String(voteData.userId) === session?.user?.id
              );
            }) || false,
          voteCount,
          commentCount,
          views,
          // Map comments with proper type casting
          comments: (Array.isArray(comments) ? comments : []).map((comment) => {
            const authorInfo = getCommentAuthorInfo(comment);
            const createdAt = hasProperty(comment, "createdAt")
              ? new Date(String(comment.createdAt))
              : new Date();
            const updatedAt = hasProperty(comment, "updatedAt")
              ? new Date(String(comment.updatedAt))
              : createdAt;

            return {
              id: hasProperty(comment, "id")
                ? String(comment.id)
                : `temp-${Math.random().toString(36).substr(2, 9)}`,
              content: hasProperty(comment, "content")
                ? String(comment.content)
                : "",
              authorId: authorInfo.id,
              authorName: authorInfo.name,
              authorImage: authorInfo.image,
              promptId: apiPrompt.id,
              createdAt,
              updatedAt,
              author: authorInfo.author,
              prompt: { id: apiPrompt.id },
            };
          }) as any,
          // Map votes with proper type casting
          votes: (Array.isArray(votes) ? votes : []).map((vote) => {
            const voteInfo = getVoteInfo(vote);

            return {
              id: voteInfo.id,
              userId: voteInfo.userId,
              promptId: apiPrompt.id,
              createdAt: voteInfo.createdAt,
              updatedAt: voteInfo.updatedAt,
              user: voteInfo.user,
              prompt: { id: apiPrompt.id },
            };
          }) as any,
          authorInfo: author
            ? {
                id: author.id,
                name: author.name || "Anonymous",
                email: author.email || null,
                image: author.image || null,
              }
            : null,
        };

        console.log("Processed prompt:", uiPrompt);
        return uiPrompt;
      } catch (error) {
        console.error("Error processing prompt data:", error, apiPrompt);
        // Return a valid UIPrompt with default values in case of error
        const errorId =
          typeof apiPrompt?.id === "string" ? apiPrompt.id : "error";
        const errorTitle =
          typeof apiPrompt?.title === "string"
            ? apiPrompt.title
            : "Error loading prompt";

        return {
          id: errorId,
          title: errorTitle,
          description: "There was an error loading this prompt",
          content: "",
          category: "general" as PromptCategory,
          isPublic: false,
          authorId: "",
          // authorName: "System", // Removed as not part of UIPrompt type
          createdAt: new Date(),
          updatedAt: new Date(),
          isOwner: false,
          hasVoted: false,
          voteCount: 0,
          commentCount: 0,
          views: 0,
          comments: [],
          votes: [],
          authorInfo: null,
        };
      }
    },
    [session?.user?.id]
  );

  // Fetch prompts based on filters and pagination
  const fetchPrompts = useCallback(
    async (isLoadMore = false) => {
      if (!isMountedRef.current) return;

      try {
        setError(null);
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        let url: string;
        if (activeTab === "my-prompts" && session) {
          url = `/api/prompts/me`;
        } else if (activeTab === "public") {
          url = `/api/prompts/public`;
        } else {
          url = `/api/prompts`;
        }

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(activeTab === "public" && { isPublic: "true" }),
        });

        const response = await fetch(`${url}?${queryParams}`);

        if (!response.ok) {
          if (response.status === 401 && activeTab === "my-prompts") {
            setError("Please sign in to view your prompts");
            return;
          }

          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `Failed to fetch prompts (${response.status})`
          );
        }

        const responseData = await response.json();
        console.log("Raw API Response:", responseData);

        if (!isMountedRef.current) return;

        // Handle different response structures
        const promptsData = responseData.data || responseData.prompts || [];
        const totalItems =
          responseData.total ||
          (Array.isArray(promptsData) ? promptsData.length : 0);
        const calculatedTotalPages =
          Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

        console.log("Processed data:", {
          promptsData,
          totalItems,
          calculatedTotalPages,
          isArray: Array.isArray(promptsData),
        });

        // Process prompts if we have an array
        let processedPrompts: UIPrompt[] = [];
        if (Array.isArray(promptsData)) {
          console.log(`Processing ${promptsData.length} prompts...`);
          processedPrompts = promptsData
            .map((prompt) => {
              try {
                return processPromptData(prompt);
              } catch (error) {
                console.error("Error processing prompt:", error, prompt);
                return null;
              }
            })
            .filter((prompt): prompt is UIPrompt => prompt !== null);
        }

        console.log(
          `Successfully processed ${processedPrompts.length} prompts`
        );

        // Update state with the new data
        setPrompts((prev) => {
          const newPrompts =
            page === 1 ? processedPrompts : [...prev, ...processedPrompts];
          console.log(`Updating prompts: ${newPrompts.length} total prompts`);
          return newPrompts;
        });

        console.log(`Setting total pages to: ${calculatedTotalPages}`);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        if (!isMountedRef.current) return;

        console.error("Error fetching prompts:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load prompts";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [page, searchQuery, activeTab, session, processPromptData]
  );

  // Handle voting on a prompt
  const handleVote = useCallback(
    async (promptId: string) => {
      if (!session) {
        toast.error("You must be signed in to vote");
        return;
      }

      try {
        const response = await fetch(`/api/prompts/${promptId}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to vote");
        }

        const data: VoteResponse = await response.json();

        // Update the local state with the new vote
        setPrompts((prevPrompts) =>
          prevPrompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  hasVoted: true,
                  voteCount: data.voteCount,
                }
              : p
          )
        );

        toast.success("Vote recorded successfully!");
      } catch (error) {
        console.error("Error voting:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred while voting"
        );
      }
    },
    [session]
  );

  // Handle prompt deletion
  const handleDeletePrompt = useCallback(
    async (promptId: string) => {
      try {
        const response = await fetch(`/api/prompts?id=${promptId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete prompt");
        }

        // Remove the deleted prompt from the local state
        setPrompts((prevPrompts) =>
          prevPrompts.filter((p) => p.id !== promptId)
        );

        // If we're on the last page with one item, go back a page
        if (prompts.length === 1 && page > 1) {
          setPage((prevPage) => prevPage - 1);
        }

        toast.success("Prompt deleted successfully");
      } catch (error) {
        console.error("Error deleting prompt:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete prompt"
        );
      }
    },
    [page, prompts.length, setPage, setPrompts]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Fetch prompts on mount and when dependencies change
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Handle page changes
  useEffect(() => {
    if (page > 1) {
      fetchPrompts();
    }
  }, [page, fetchPrompts]);

  // Reset page when tab or search changes
  useEffect(() => {
    if (page > 1) {
      setPage(1);
    }
  }, [activeTab, searchQuery, page]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Loading state
  if (isLoading && prompts.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Card */}
      <Card className="w-full max-w-4xl mx-auto">
        {/* Title */}
        <CardHeader className="pb-2">
          <h1 className="text-2xl font-bold tracking-tight">Explore Prompts</h1>
          <p className="text-sm text-muted-foreground">
            Browse and discover prompts created by the community
          </p>
        </CardHeader>

        {/* Tabs */}
        <div className="px-6 pb-2">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Public Prompts</TabsTrigger>
              <TabsTrigger value="my-prompts" disabled={!session}>
                My Prompts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        <CardContent>
          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Prompts Grid */}
          {prompts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onView={(prompt) => {
                    setSelectedPrompt(prompt);
                    setIsPreviewOpen(true);
                  }}
                  onVote={handleVote}
                  onDelete={
                    activeTab === "my-prompts" ? handleDeletePrompt : undefined
                  }
                  isOwner={activeTab === "my-prompts"}
                  hasVoted={prompt.hasVoted}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading prompts...
                  </div>
                ) : activeTab === "my-prompts" && !session ? (
                  "Please sign in to view your prompts"
                ) : searchQuery ? (
                  `No prompts found for "${searchQuery}"`
                ) : (
                  "No prompts available"
                )}
              </div>
            </div>
          )}

          {/* Load More Button */}
          {prompts.length > 0 && page < totalPages && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {selectedPrompt && (
        <PromptPreviewModal
          prompt={selectedPrompt}
          open={isPreviewOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsPreviewOpen(false);
              // Delay clearing selected prompt to avoid UI flash
              setTimeout(() => setSelectedPrompt(null), 300);
            }
          }}
          onVote={handleVote}
        />
      )}
    </div>
  );
}

ExplorePanel.displayName = "ExplorePanel";

export default ExplorePanel;
