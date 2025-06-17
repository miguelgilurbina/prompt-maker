// src/app/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PromptBuilder } from "@/components/prompts/PromptBuilder";
import { LibraryBrowser } from "@/components/prompts/LibraryBrowser";
import { SearchBar } from "@/components/prompts/SearchBar";
import { Prompt, PromptCategory } from "@shared/types/prompt.types";
import { Book, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { savePrompt } from "@/lib/services/promptService";
import { useRouter } from "next/navigation";

// Definimos las interfaces
interface FilterOptions {
  platform: string[];
  type: string[];
}

interface Category {
  id: PromptCategory;
  name: string;
}

// Datos de ejemplo actualizados
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Photorealistic Image Generation",
    content: "Create a photorealistic image of...",
    category: "creative-writing",
    tags: ["midjourney", "photorealistic"],
    createdAt: new Date(),
    updatedAt: new Date(),
    variables: [
      {
        id: "subject",
        name: "subject",
        type: "text",
        description: "Main subject of the image",
      },
    ],
  },
  {
    id: "2",
    title: "Technical Analysis Template",
    content: "Write a detailed analysis of {{topic}} focusing on {{aspects}}",
    category: "technical",
    tags: ["chatgpt", "analysis"],
    createdAt: new Date(),
    updatedAt: new Date(),
    variables: [
      {
        id: "topic",
        name: "topic",
        type: "text",
        description: "Main topic to analyze",
      },
      {
        id: "aspects",
        name: "aspects",
        type: "text",
        description: "Specific aspects to focus on",
      },
    ],
  },
];

const mockCategories: Category[] = [
  { id: "creative-writing", name: "Creative Writing" },
  { id: "technical", name: "Technical" },
  { id: "business", name: "Business" },
  { id: "academic", name: "Academic" },
  { id: "general", name: "General" },
  { id: "custom", name: "Custom" },
];

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [libraryWidth, setLibraryWidth] = useState(500); // Initial width in pixels
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (query: string, filters: FilterOptions) => {
    console.log("Search:", query, filters);
  };

  const handleSavePrompt = async (prompt: Prompt) => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const result = await savePrompt(prompt, prompt.isPublic);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your prompt has been saved successfully.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // If saved as public, navigate to explore page
                if (prompt.isPublic) {
                  router.push('/explore');
                }
              }}
            >
              {prompt.isPublic ? 'View in Explore' : 'OK'}
            </Button>
          ),
        });
        
        // Clear the form after successful save
        setSelectedPrompt(null);
      } else {
        throw new Error(result.error || 'Failed to save prompt');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the prompt';
      console.error('Error saving prompt:', error);
      setSaveError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 300 && newWidth < 1000) { // Min and max width constraints
        setLibraryWidth(newWidth);
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <main className="container mx-auto p-4 flex flex-col h-screen">
             <div className="flex justify-center items-center mb-4">
        <Button
          onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          variant="outline"
          size="icon"
          className="mr-2"
        >
          <Book className="h-5 w-5" />
        </Button>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Library Browser - Resizable Panel */}
        {isLibraryOpen && (
          <div
            ref={sidebarRef}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex-shrink-0"
            style={{ width: libraryWidth }}
          >
            <div className="p-4 h-full overflow-y-auto">
              <LibraryBrowser
                categories={mockCategories}
                instructions={mockPrompts}
                onSelect={handleSelectPrompt}
              />
            </div>
          </div>
        )}

        {/* Resizer Handle */}
        {isLibraryOpen && (
            <div
                onMouseDown={handleMouseDown}
                className="w-2 cursor-col-resize bg-gray-300 hover:bg-indigo-500 transition-colors duration-200 flex-shrink-0"
            />
        )}

        {/* Prompt Builder - Takes remaining space */}
        <div className="flex-grow h-full ml-2 relative">
          {isSaving && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2 bg-background p-6 rounded-lg shadow-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Saving your prompt...</p>
              </div>
            </div>
          )}
          
          <PromptBuilder
            key={selectedPrompt?.id || 'new-prompt'}
            initialPrompt={selectedPrompt || undefined}
            onSave={handleSavePrompt}
          />
          
          {saveError && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{saveError}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
