// src/components/prompts/SearchBar.tsx
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOptions {
  platform: string[];
  type: string[];
}

interface SearchBarProps {
  onSearch: (query: string, filters: FilterOptions) => void;
  platforms?: string[];
  types?: string[];
}

export function SearchBar({
  onSearch,
  platforms = ["Midjourney", "ChatGPT", "Claude"],
  types = ["Image", "Text", "Code"],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    type: [],
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleFilterChange = (category: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts..."
            className="pl-8"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={filters.platform.includes(platform)}
                        onCheckedChange={() =>
                          handleFilterChange("platform", platform)
                        }
                      />
                      <Label htmlFor={platform}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.type.includes(type)}
                        onCheckedChange={() => handleFilterChange("type", type)}
                      />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
