"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Theme } from "@/lib/types/theme";

const themes = [
  { name: "Tech-Focused", id: "tech" },
  { name: "Creative-Modern", id: "creative" },
  { name: "Clean-Minimal", id: "clean" },
] as const;

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="flex space-x-4 mb-8">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant={
              currentTheme === (theme.id as unknown as typeof currentTheme)
                ? "default"
                : "outline"
            }
            onClick={() => setTheme(theme.id as unknown as Theme)}
          >
            {theme.name}
          </Button>
        ))}
      </div>

      {/* Color Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-20 bg-primary rounded-md" />
            <Button className="w-full">Primary Button</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secondary Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-20 bg-secondary rounded-md" />
            <Button variant="secondary" className="w-full">
              Secondary Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accent Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-20 bg-accent rounded-md" />
            <Button variant="outline" className="w-full">
              Accent Button
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Example Components */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Example Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">Primary Text</p>
          <p className="text-muted-foreground">Muted Text</p>
          <div className="flex space-x-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
