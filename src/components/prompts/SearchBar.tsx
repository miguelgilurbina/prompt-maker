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
import { cn } from "@/lib/utils/utils";

interface FilterOptions {
  platform: string[];
  type: string[];
}

interface SearchBarProps {
  onSearch: (query: string, filters: FilterOptions) => void;
  platforms?: string[];
  types?: string[];
  className?: string;
}

export function SearchBar({
  onSearch,
  platforms = ["Midjourney", "ChatGPT", "Claude"],
  types = ["Image", "Text", "Code"],
  className = "",
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
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search prompts..."
          className="pl-10 pr-4 py-2 w-full rounded-md bg-background text-foreground"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end" sideOffset={8}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Platforms</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={filters.platform.includes(platform)}
                          onCheckedChange={() =>
                            handleFilterChange("platform", platform)
                          }
                        />
                        <Label
                          htmlFor={`platform-${platform}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Types</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {types.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.type.includes(type)}
                          onCheckedChange={() => handleFilterChange("type", type)}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
