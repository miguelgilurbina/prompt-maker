// src/components/prompts/LibraryBrowser.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prompt, PromptCategory } from "@/lib/types/prompt.types";

interface Category {
  id: PromptCategory;
  name: string;
}

interface LibraryBrowserProps {
  categories: Category[];
  instructions: Prompt[];
  onSelect: (instruction: Prompt) => void;
}

export function LibraryBrowser({
  categories,
  instructions,
  onSelect,
}: LibraryBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    PromptCategory | "all"
  >("all");

  const filteredInstructions =
    selectedCategory === "all"
      ? instructions
      : instructions.filter((inst) => inst.category === selectedCategory);

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>Instructions Library</CardTitle>
        <div className="flex gap-4">
          <Input placeholder="Search instructions..." className="max-w-sm" />
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as PromptCategory | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInstructions.map((instruction) => (
              <Card
                key={instruction.id}
                className="cursor-pointer hover:bg-secondary/10"
                onClick={() => onSelect(instruction)}
              >
                <CardContent className="p-4">
                  <p className="text-sm font-mono">{instruction.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {instruction.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
