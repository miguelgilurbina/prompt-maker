// src/app/page.tsx
"use client";

import { useState } from "react";
import { PromptBuilder } from "@/components/prompts/PromptBuilder";
import { LibraryBrowser } from "@/components/prompts/LibraryBrowser";
import { SearchBar } from "@/components/prompts/SearchBar";
import { Prompt, PromptCategory } from "@shared/types/prompt.types";

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

  const handleSearch = (query: string, filters: FilterOptions) => {
    console.log("Search:", query, filters);
    // Implementar lógica de búsqueda
  };

  const handleSavePrompt = (prompt: Prompt) => {
    console.log("Saved prompt:", prompt);
    // Implementar lógica de guardado
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LibraryBrowser
          categories={mockCategories}
          instructions={mockPrompts}
          onSelect={handleSelectPrompt}
        />

        <PromptBuilder
          initialPrompt={selectedPrompt || undefined}
          onSave={handleSavePrompt}
        />
      </div>
    </main>
  );
}
