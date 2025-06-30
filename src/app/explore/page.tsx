'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useSWR from 'swr';
import { PromptCard, type Prompt } from '@/components/prompts/PromptCard';

const API_BASE_URL = '/api/prompts';

// Define the API response type
interface ApiResponse {
  data: Prompt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Define a custom error type for API responses
class FetcherError extends Error {
  status: number;
  info: unknown;
  
  constructor(message: string, status: number, info: unknown) {
    super(message);
    this.name = 'FetcherError';
    this.status = status;
    this.info = info;
  }
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorInfo = await res.json().catch(() => ({}));
    throw new FetcherError(
      'An error occurred while fetching the data.',
      res.status,
      errorInfo
    );
  }
  return res.json() as Promise<ApiResponse>;
};

export default function ExplorePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('public');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch public prompts with search
  const { 
    data: publicData, 
    error: publicError, 
    isLoading: isPublicLoading 
  } = useSWR<ApiResponse>(
    `${API_BASE_URL}?search=${encodeURIComponent(searchQuery)}`,
    fetcher
  );

  // Fetch user's prompts when authenticated
  const { 
    data: userData, 
    error: userError, 
    isLoading: isUserLoading 
  } = useSWR<ApiResponse>(
    session ? `${API_BASE_URL}/me?search=${encodeURIComponent(searchQuery)}` : null,
    fetcher
  );

  // Determine which data to show based on active tab
  const currentPrompts = activeTab === 'public' 
    ? publicData?.data || [] 
    : userData?.data || [];
  
  // Determine loading and error states based on active tab
  const isLoading = activeTab === 'public' ? isPublicLoading : isUserLoading;
  const error = activeTab === 'public' ? publicError : userError;
  
  // Check if the current user is the owner of a prompt
  const isOwner = (prompt: Prompt) => {
    return session?.user?.email === prompt.author?.email;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Explore Prompts</h1>
              <p className="text-muted-foreground">
                {activeTab === 'public' 
                  ? 'Discover and use prompts created by the community' 
                  : 'View and manage your saved prompts'}
              </p>
            </div>
            <Button asChild>
              <Link href="/prompts/new" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Prompt
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="public">Public Prompts</TabsTrigger>
                <TabsTrigger 
                  value="mine" 
                  disabled={!session}
                  className={!session ? 'opacity-50' : ''}
                >
                  My Prompts
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {!session && activeTab === 'mine' ? (
              <div className="rounded-lg border p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Sign in to view your prompts</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to create, view, and manage your prompts
                </p>
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  {activeTab === 'public' ? 'Loading public prompts...' : 'Loading your prompts...'}
                </p>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                <div className="flex items-start">
                  <AlertCircle className="mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">
                      {activeTab === 'public' 
                        ? 'Error loading public prompts' 
                        : 'Error loading your prompts'}
                    </h3>
                    <p className="text-sm mt-1">
                      {activeTab === 'public' 
                        ? 'There was a problem loading public prompts. Please try again later.'
                        : (error as FetcherError).status === 401 
                          ? 'Your session has expired. Please sign in again.'
                          : 'There was a problem loading your prompts. Please try again later.'
                      }
                    </p>
                    {(error as FetcherError).status === 401 && (
                      <Button variant="outline" size="sm" className="mt-3" asChild>
                        <Link href="/auth/signin">Sign In Again</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : currentPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {activeTab === 'public' 
                    ? 'No public prompts found' 
                    : 'You haven\'t created any prompts yet'}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">
                  {activeTab === 'public'
                    ? 'Be the first to create and share a prompt with the community!'
                    : 'Get started by creating your first prompt'}
                </p>
                <Button asChild>
                  <Link href="/prompts/new" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Prompt
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPrompts.map((prompt) => (
                  <PromptCard 
                    key={prompt.id} 
                    prompt={prompt} 
                    isOwner={isOwner(prompt)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptCard({ prompt, isOwner = false }: { prompt: Prompt; isOwner?: boolean }) {
  return (
    <Card className="flex h-full flex-col p-6 transition-colors hover:bg-accent/50">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{prompt.title}</h3>
          {isOwner && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              Yours
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {prompt.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            by {prompt.author?.name || prompt.author?.email || 'Anonymous'}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/prompts/${prompt.id}`}>View</Link>
        </Button>
        {isOwner && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/prompts/${prompt.id}/edit`}>Edit</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
