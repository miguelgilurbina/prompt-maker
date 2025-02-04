// src/components/prompts/PromptBuilder.tsx
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PromptBuilderProps {
  initialPrompt?: string;
  onSave: (prompt: string) => void;
}

export function PromptBuilder({
  initialPrompt = "",
  onSave,
}: PromptBuilderProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  //   const [history, setHistory] = useState<string[]>([initialPrompt]);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    // Aquí podríamos agregar debounce para el historial
    // setHistory((prev) => [...prev, value]);
  };

  const handleSave = () => {
    onSave(prompt);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Start writing your prompt..."
          className="min-h-[200px] font-mono"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setPrompt(initialPrompt)}>
            Reset
          </Button>
          <Button onClick={handleSave}>Save Prompt</Button>
        </div>
      </CardContent>
    </Card>
  );
}
