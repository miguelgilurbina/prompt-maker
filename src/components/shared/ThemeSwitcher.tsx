"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { themes } from "@/lib/themes";

const themeOptions = [
  { name: "Japanese Minimal", value: "japaneseMinimal" },
  { name: "Matrix Digital", value: "matrixTheme" },
] as const;

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="flex space-x-4 mb-8">
        {themeOptions.map((theme) => {
          const themeObj = themes[theme.value as keyof typeof themes];
          return (
            <Button
              key={theme.value}
              variant={
                currentTheme.name === themeObj.name ? "default" : "outline"
              }
              onClick={() => setTheme(themeObj)}
            >
              {theme.name}
            </Button>
          );
        })}
      </div>

      {/* Color Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Your color swatches here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
