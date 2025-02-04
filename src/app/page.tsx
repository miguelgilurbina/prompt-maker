// src/app/page.tsx
"use client";

import { useState } from "react";
import { PromptBuilder } from "@/components/prompts/PromptBuilder";
import { LibraryBrowser } from "@/components/prompts/LibraryBrowser";
import { SearchBar } from "@/components/prompts/SearchBar";

// Definimos las interfaces
interface FilterOptions {
  platform: string[];
  type: string[];
}

interface Instruction {
  id: string;
  content: string;
  category: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
}

// Datos de ejemplo
const mockInstructions: Instruction[] = [
  {
    id: "1",
    content: "Create a photorealistic image of...",
    category: "image",
    tags: ["midjourney", "photorealistic"],
  },
  {
    id: "2",
    content: "Write a detailed analysis of...",
    category: "text",
    tags: ["chatgpt", "analysis"],
  },
  // Más ejemplos...
];

const mockCategories: Category[] = [
  { id: "image", name: "Image Generation" },
  { id: "text", name: "Text Analysis" },
  { id: "code", name: "Code Generation" },
];

export default function Home() {
  const [selectedInstruction, setSelectedInstruction] = useState<string>("");

  const handleSearch = (query: string, filters: FilterOptions) => {
    console.log("Search:", query, filters);
  };

  const handleSavePrompt = (prompt: string) => {
    console.log("Saved prompt:", prompt);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LibraryBrowser
          categories={mockCategories}
          instructions={mockInstructions}
          onSelect={(instruction) =>
            setSelectedInstruction(instruction.content)
          }
        />

        <PromptBuilder
          initialPrompt={selectedInstruction}
          onSave={handleSavePrompt}
        />
      </div>
    </main>
  );
}
