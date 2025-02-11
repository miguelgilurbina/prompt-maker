// src/components/theme/ThemeToggle.tsx
"use client";

import { useTheme } from "./ThemeProvider";
import { themes } from "@/lib/themes/index";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paintbrush } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([key, themeOption]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(themeOption)}
            className={theme.name === themeOption.name ? "bg-accent/10" : ""}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: `hsl(${themeOption.colors.accent})` }}
              />
              {themeOption.name}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
