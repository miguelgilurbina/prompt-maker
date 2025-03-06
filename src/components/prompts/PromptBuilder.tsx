// src/components/prompts/PromptBuilder.tsx
"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Prompt, PromptCategory, PromptEditorState } from "@/lib/types/prompt";

import { mergeWithEmptyPrompt } from "@/lib/utils/promptUtils";

interface PromptBuilderProps {
  initialPrompt?: Partial<Prompt>;
  onSave: (prompt: Prompt) => void;
  onCancel?: () => void;
}

export function PromptBuilder({
  initialPrompt = {},
  onSave,
  onCancel,
}: PromptBuilderProps) {
  const [editorState, setEditorState] = useState<PromptEditorState>({
    currentPrompt: mergeWithEmptyPrompt(initialPrompt),
    isDirty: false,
    variables: new Map(),
    history: [],
    previewMode: false,
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const handleChange = useCallback(
    <T extends keyof Prompt>(field: T, value: Prompt[T]) => {
      setEditorState((prev) => ({
        ...prev,
        isDirty: true,
        currentPrompt: {
          ...prev.currentPrompt!,
          [field]: value,
          updatedAt: new Date(),
        },
      }));
    },
    []
  );

  const processPromptContent = useCallback(
    (content: string) => {
      let processedContent = content;
      editorState.variables.forEach((value, key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        processedContent = processedContent.replace(regex, value);
      });
      return processedContent;
    },
    [editorState.variables]
  );

  const handleSave = useCallback(() => {
    if (
      !editorState.currentPrompt?.title ||
      !editorState.currentPrompt?.content
    ) {
      return;
    }

    const promptToSave: Prompt = {
      ...editorState.currentPrompt,
      updatedAt: new Date(),
      variables: Array.from(editorState.variables.entries()).map(
        ([id, value]) => ({
          id,
          name: id,
          type: "text",
          defaultValue: value,
        })
      ),
    };

    onSave(promptToSave);
    setEditorState((prev) => ({ ...prev, isDirty: false }));
  }, [editorState, onSave]);

  const handleReset = useCallback(() => {
    setEditorState({
      currentPrompt: mergeWithEmptyPrompt(initialPrompt),
      isDirty: false,
      variables: new Map(),
      history: [],
      previewMode: false,
    });
  }, [initialPrompt]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Input
              value={editorState.currentPrompt?.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Prompt Title"
              className="font-medium"
            />
            <Textarea
              value={editorState.currentPrompt?.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description (optional)"
              className="font-mono"
            />
            <Textarea
              value={editorState.currentPrompt?.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Start writing your prompt..."
              className="min-h-[200px] font-mono"
            />
            <Select
              value={editorState.currentPrompt?.category || "general"}
              onValueChange={(value: PromptCategory) =>
                handleChange("category", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creative-writing">
                  Creative Writing
                </SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={editorState.currentPrompt?.tags?.join(", ") || ""}
              onChange={(e) =>
                handleChange(
                  "tags",
                  e.target.value.split(",").map((t) => t.trim())
                )
              }
              placeholder="Tags (comma separated)"
              className="font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">
                {editorState.currentPrompt?.title || "Untitled Prompt"}
              </h2>
              {editorState.currentPrompt?.description && (
                <p className="text-muted-foreground mb-4">
                  {editorState.currentPrompt.description}
                </p>
              )}
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {processPromptContent(
                    editorState.currentPrompt?.content || ""
                  )}
                </pre>
              </div>
              {editorState.currentPrompt?.tags &&
                editorState.currentPrompt.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {editorState.currentPrompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              <div className="mt-4 text-sm text-muted-foreground">
                Category: {editorState.currentPrompt?.category || "General"}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={!editorState.isDirty}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!editorState.isDirty}
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !editorState.isDirty ||
            !editorState.currentPrompt?.title ||
            !editorState.currentPrompt?.content
          }
        >
          Save Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
