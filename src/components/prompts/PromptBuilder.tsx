// src/components/prompts/PromptBuilder.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// Separator component doesn't exist, we'll use a simple div
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Eye,
  EyeOff,
  Clock,
  AlertCircle,
  Check,
  // Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { formatDistanceToNow } from "date-fns";

import { PromptFormData, PromptCategory } from "@/lib/types/prompt.types";

// Component Interface
interface PromptBuilderProps {
  /** Initial prompt data to edit, if any */
  initialPrompt?: Partial<PromptFormData>;
  /** Callback when the prompt is saved */
  onSave: (data: Omit<PromptFormData, "authorName">) => Promise<void>;
  /** Callback when the form is cancelled */
  onCancel: () => void;
  /** Loading state for save operations */
  isSaving?: boolean;
}

interface EditorState {
  currentPrompt: PromptFormData;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  previewMode: boolean;
  lastSaved?: Date;
}

// Predefined categories
const PROMPT_CATEGORIES: PromptCategory[] = [
  "creative-writing",
  "technical",
  "business",
  "academic",
  "general",
  "custom",
];

export function PromptBuilder({
  initialPrompt = {},
  onSave,
  onCancel,
  isSaving = false,
}: PromptBuilderProps) {
  // Initialize form data from initialPrompt
  const initializePrompt = (): PromptFormData => ({
    title: initialPrompt.title || "",
    description: initialPrompt.description || null,
    content: initialPrompt.content || "",
    category: initialPrompt.category || "general",
    isPublic: initialPrompt.isPublic ?? true,
    authorName: initialPrompt.authorName || null,
  });

  // State management
  const [editorState, setEditorState] = useState<EditorState>({
    currentPrompt: initializePrompt(),
    isDirty: false,
    validationErrors: {},
    previewMode: false,
    // lastSaved is optional and will be undefined initially
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Validation function
  const validateForm = useCallback(
    (formData: PromptFormData): Record<string, string> => {
      const errors: Record<string, string> = {};

      // Title validation
      if (!formData.title.trim()) {
        errors.title = "Title is required";
      } else if (formData.title.length > 200) {
        errors.title = "Title must be 200 characters or less";
      }

      // Content validation
      if (!formData.content.trim()) {
        errors.content = "Content is required";
      } else if (formData.content.length < 10) {
        errors.content = "Content must be at least 10 characters";
      }

      // Category validation
      if (!formData.category) {
        errors.category = "Category is required";
      }

      return errors;
    },
    []
  );

  // Field change handler
  const handleFieldChange = useCallback(
    <T extends keyof PromptFormData>(field: T, value: PromptFormData[T]) => {
      setEditorState((prev) => ({
        ...prev,
        isDirty: true,
        currentPrompt: {
          ...prev.currentPrompt!,
          [field]: value,
        },
        validationErrors: {
          ...prev.validationErrors,
          [field]: "", // Clear error when user types
        },
      }));
    },
    []
  );

  // Preview generation
  const generatePreview = useCallback((content: string) => {
    return content;
  }, []);

  // Save handlers
  const handleSave = useCallback(async () => {
    if (!editorState.currentPrompt) return;

    const errors = validateForm(editorState.currentPrompt);

    if (Object.keys(errors).length > 0) {
      setEditorState((prev) => ({
        ...prev,
        validationErrors: errors,
      }));
      toast({
        title: "Validation Error",
        description: "Please fix validation errors before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorName, ...promptData } = editorState.currentPrompt;
      await onSave(promptData);

      setEditorState((prev) => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date(),
        validationErrors: {},
      }));
    } catch (error) {
      console.error("Save error:", error);
      // Let parent component handle error display
    }
  }, [editorState.currentPrompt, onSave, validateForm]);

  const handleCancel = useCallback(() => {
    if (editorState.isDirty) {
      setShowUnsavedWarning(true);
    } else {
      onCancel();
    }
  }, [editorState.isDirty, onCancel]);

  const confirmCancel = useCallback(() => {
    setShowUnsavedWarning(false);
    onCancel();
  }, [onCancel]);

  // Memoized preview content
  const previewContent = useMemo(() => {
    if (!editorState.currentPrompt) return "";
    return generatePreview(editorState.currentPrompt.content);
  }, [editorState.currentPrompt, generatePreview]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "Escape":
            e.preventDefault();
            handleCancel();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleCancel]);

  if (!editorState.currentPrompt) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {initialPrompt.id ? "Edit Prompt" : "Create New Prompt"}
              {editorState.isDirty && (
                <Badge variant="outline" className="text-orange-600">
                  <Circle className="w-2 h-2 mr-1 fill-current" />
                  Unsaved
                </Badge>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Cancel Button */}
              {/* <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button> */}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Main Content */}
        <CardContent className="px-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "edit" | "preview")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6 mt-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter prompt title"
                    value={editorState.currentPrompt.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className={
                      editorState.validationErrors.title ? "border-red-500" : ""
                    }
                  />
                  {editorState.validationErrors.title && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {editorState.validationErrors.title}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional description of your prompt"
                    value={editorState.currentPrompt.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value || null)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Prompt Content <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your prompt content here."
                    value={editorState.currentPrompt.content}
                    onChange={(e) =>
                      handleFieldChange("content", e.target.value)
                    }
                    className={
                      editorState.validationErrors.content
                        ? "border-red-500"
                        : ""
                    }
                    rows={8}
                  />
                  {editorState.validationErrors.content && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {editorState.validationErrors.content}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={editorState.currentPrompt.category}
                      onValueChange={(value) =>
                        handleFieldChange("category", value as PromptCategory)
                      }
                    >
                      <SelectTrigger
                        className={
                          editorState.validationErrors.category
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROMPT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editorState.validationErrors.category && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {editorState.validationErrors.category}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                      id="authorName"
                      placeholder="Your display name (optional)"
                      value={editorState.currentPrompt.authorName || ""}
                      onChange={(e) =>
                        handleFieldChange("authorName", e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border my-4" />

              {/* Visibility Settings */}
              <div className="space-y-4">
                <Label>Visibility</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={editorState.currentPrompt.isPublic}
                    onCheckedChange={(checked) =>
                      handleFieldChange("isPublic", !!checked)
                    }
                  />
                  <Label htmlFor="isPublic" className="flex items-center gap-2">
                    {editorState.currentPrompt.isPublic ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    {editorState.currentPrompt.isPublic
                      ? "Public (visible to everyone)"
                      : "Private (only visible to you)"}
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Live Preview</Label>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {previewContent || "No content to preview"}
                  </div>
                </div>

                {editorState.currentPrompt.content && !previewContent && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Preview could not be generated. Check your prompt content.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between border-t">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {editorState.isDirty && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                Auto-saving...
              </div>
            )}

            {editorState.lastSaved && (
              <div className="flex items-center gap-1 text-green-600">
                <Check className="w-4 h-4" />
                Saved{" "}
                {formatDistanceToNow(editorState.lastSaved, {
                  addSuffix: true,
                })}
              </div>
            )}

            {!editorState.isDirty && !editorState.lastSaved && (
              <div className="text-gray-400">No changes yet</div>
            )}

            <div className="text-xs">
              {editorState.currentPrompt.content.length} characters
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            {/* <Button
              onClick={handleSave}
              disabled={isSaving || !editorState.currentPrompt.title.trim() || !editorState.currentPrompt.content.trim()}
              className="min-w-[80px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button> 
          </div>*/}
        </CardFooter>
      </Card>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Unsaved Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                You have unsaved changes. Are you sure you want to leave without
                saving?
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUnsavedWarning(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                Leave Without Saving
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

// Helper component for the circle indicator
function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="3" />
    </svg>
  );
}
