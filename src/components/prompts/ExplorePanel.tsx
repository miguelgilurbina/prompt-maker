// src/components/prompts/ExplorePanel.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { debounce } from "lodash";
import { Search, Loader2, AlertCircle } from "lucide-react";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Custom Components
import { PromptCard } from "./PromptCard";
import { PromptPreviewModal } from "./PromptPreviewModal";

// Types
import type {
  UIPrompt,
  PromptVariable,
  PromptCategory,
} from "@/lib/types/database.types";
import type {
  User,
  Vote as PrismaVote,
  Comment as PrismaComment,
} from "@prisma/client";

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

// Extended types to match the component's needs
type UIComment = Omit<PrismaComment, "author" | "prompt"> & {
  authorName: string;
  authorImage: string | null;
  author: User | null;
  prompt: { id: string } | null;
};

type UIVote = Omit<PrismaVote, "user" | "prompt"> & {
  user: User | null;
  prompt: { id: string } | null;
  updatedAt: Date;
};

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
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
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
          tags: Array.isArray(apiPrompt.tags) ? apiPrompt.tags : [],
          isPublic: !!apiPrompt.isPublic,
          authorId: apiPrompt.authorId,
          authorName: author?.name || "Anonymous",
          createdAt: new Date(apiPrompt.createdAt || Date.now()),
          updatedAt: new Date(apiPrompt.updatedAt || Date.now()),
          // Map variables to ensure they match the expected type
          variables: (Array.isArray(apiPrompt.variables)
            ? apiPrompt.variables
            : []
          ).map(
            (v) =>
              ({
                id: hasProperty(v, "id")
                  ? String(v.id)
                  : `var-${Math.random().toString(36).substr(2, 9)}`,
                name: hasProperty(v, "name") ? String(v.name) : "variable",
                type: (hasProperty(v, "type") &&
                ["number", "text", "select", "multiline"].includes(
                  String(v.type)
                )
                  ? v.type
                  : "text") as "number" | "text" | "select" | "multiline",
                required: hasProperty(v, "required")
                  ? Boolean(v.required)
                  : false,
                defaultValue: hasProperty(v, "defaultValue")
                  ? String(v.defaultValue || "")
                  : "",
              } as PromptVariable)
          ),
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
          // Map comments to match UIComment type
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
            } as UIComment;
          }),
          // Map votes to match UIVote type
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
            } as UIVote;
          }),
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
          tags: [],
          isPublic: false,
          authorId: "",
          authorName: "System",
          createdAt: new Date(),
          updatedAt: new Date(),
          variables: [],
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
          setIsInitialLoad(false);
        }
      }
    },
    [page, searchQuery, activeTab, session, processPromptData]
  );

  // Handle voting on a prompt
  const handleVote = useCallback(
    async (promptId: string) => {
      if (!session) {
        toast.info("Please sign in to vote");
        return;
      }

      try {
        const response = await fetch(`/api/prompts/${promptId}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to submit vote");
        }

        const data: VoteResponse = await response.json();

        // Update prompts with new vote data
        setPrompts((prevPrompts) =>
          prevPrompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  voteCount: data.voteCount || data.votes.length,
                  hasVoted: data.votes.some(
                    (v: PrismaVote) => v.userId === session.user.id
                  ),
                }
              : p
          )
        );

        // Update selected prompt if it's being viewed
        setSelectedPrompt((prev) =>
          prev?.id === promptId
            ? {
                ...prev,
                voteCount: data.voteCount || data.votes.length,
                hasVoted: data.votes.some(
                  (v: PrismaVote) => v.userId === session.user.id
                ),
              }
            : prev
        );

        toast.success("Vote registered!");
      } catch (error) {
        console.error("Error voting on prompt:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to register vote";
        toast.error(errorMessage);
      }
    },
    [session]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabType);
    setPage(1);
    setPrompts([]);
    setError(null);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  // Handle prompt view
  const handleViewPrompt = useCallback((prompt: UIPrompt) => {
    setSelectedPrompt(prompt);
    setIsPreviewOpen(true);
  }, []);

  // Handle preview close
  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    // Delay clearing selected prompt to avoid UI flash
    setTimeout(() => setSelectedPrompt(null), 300);
  }, []);

  // Convert UIPrompt to the format expected by PromptPreviewModal
  const convertUIPromptForModal = useCallback(
    (uiPrompt: UIPrompt): UIPrompt => {
      // Return the UIPrompt as-is since PromptPreviewModal expects UIPrompt type
      // Ensure all required UIPrompt properties are present
      return {
        ...uiPrompt,
        // Ensure optional UI properties have default values if needed
        isOwner: uiPrompt.isOwner ?? false,
        hasVoted: uiPrompt.hasVoted ?? false,
        voteCount: uiPrompt.voteCount ?? 0,
        commentCount: uiPrompt.commentCount ?? 0,
        authorInfo: uiPrompt.authorInfo ?? null,
      };
    },
    []
  );

  // Effects
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    // Reset when tab or search changes
    if (!isInitialLoad) {
      setPage(1);
      setPrompts([]);
    }
  }, [searchQuery, activeTab, isInitialLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Render loading state
  if (isInitialLoad && isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Explore Prompts</CardTitle>
            {session && (
              <Link href="/prompts/new">
                <Button>Create Prompt</Button>
              </Link>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search prompts..."
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Search prompts"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="my-prompts" disabled={!session}>
                My Prompts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sin sesión en tab "Mis Prompts" */}
        {!session && activeTab === "my-prompts" ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg p-6 bg-muted/5">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Sign in to view your prompts
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Sign in to access your personal prompts and manage them securely.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          </div>
        ) : isLoading && prompts.length === 0 ? (
          // Loading inicial
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : prompts.length > 0 ? (
          // Lista de prompts
          <div className="space-y-6">
            <div className="grid gap-6">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="hover:scale-[1.01] transition-transform duration-200"
                >
                  <PromptCard
                    prompt={prompt}
                    onView={handleViewPrompt}
                    onVote={handleVote}
                    isOwner={prompt.isOwner}
                    hasVoted={prompt.hasVoted}
                  />
                </div>
              ))}
            </div>

            {/* Load more button */}
            {page < totalPages && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Estado vacío
          <div className="text-center py-16 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">
              {activeTab === "public"
                ? "No se encontraron prompts públicos"
                : "No has creado ningún prompt aún"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {activeTab === "public"
                ? "Sé el primero en compartir un prompt con la comunidad."
                : "Crea tu primer prompt para empezar a usarlo en tus proyectos."}
            </p>
          </div>
        )}
      </CardContent>

      {/* Preview Modal */}
      {selectedPrompt && (
        <PromptPreviewModal
          prompt={convertUIPromptForModal(selectedPrompt)}
          open={isPreviewOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleClosePreview();
            }
          }}
          onVote={handleVote}
        />
      )}
    </Card>
  );
}

ExplorePanel.displayName = "ExplorePanel";

export default ExplorePanel;
