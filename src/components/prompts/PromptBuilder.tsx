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
  Plus,
  Save,
  X,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import {
  Prompt,
  PromptCategory,
  PromptVariable,
  User,
} from "@/lib/types/database.types";
import { PromptFormData } from "@/lib/types/prompt.types";

// Extended PromptEditorState with missing properties
interface ExtendedPromptEditorState {
  currentPrompt: PromptFormData;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  variables: Map<string, string>;
  history: string[];
  previewMode: boolean;
  isLoading?: boolean;
  lastSaved?: Date;
}

// Component Interface
interface PromptBuilderProps {
  /** Initial prompt data to edit, if any */
  initialPrompt?: Partial<Prompt>;
  /** Callback when the prompt is saved */
  onSave: (prompt: Omit<PromptFormData, "authorName">) => Promise<void>;
  /** Callback when the form is cancelled */
  onCancel: () => void;
  /** Current user session */
  user?: User | null;
  /** Loading state for save operations */
  isSaving?: boolean;
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

const VARIABLE_TYPES = ["text", "number", "select", "multiline"] as const;
type VariableType = typeof VARIABLE_TYPES[number];

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
    tags: initialPrompt.tags || [],
    variables: initialPrompt.variables || null,
    isPublic: initialPrompt.isPublic ?? true,
    authorName: initialPrompt.authorName || null,
    authorId: initialPrompt.authorId || null,
  });

  // State management
  const [editorState, setEditorState] = useState<ExtendedPromptEditorState>({
    currentPrompt: initializePrompt(),
    isDirty: false,
    validationErrors: {},
    variables: new Map<string, string>(),
    history: [],
    previewMode: false,
    isLoading: false,
    lastSaved: undefined,
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [newTag, setNewTag] = useState("");
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

      // Tags validation
      if (formData.tags.length > 10) {
        errors.tags = "Maximum 10 tags allowed";
      }

      formData.tags.forEach((tag) => {
        if (tag.length > 50) {
          errors.tags = `Tag "${tag}" is too long (max 50 characters)`;
        }
      });

      // Variables validation
      const variableNames = formData.variables?.map((v) =>
        v.name.toLowerCase()
      );
      const uniqueNames = new Set(variableNames);
      if (variableNames?.length !== uniqueNames.size) {
        errors.variables = "Variable names must be unique";
      }

      formData.variables?.forEach((variable, index) => {
        if (!variable.name.trim()) {
          errors.variables = `Variable ${index + 1} name is required`;
        }
        if (
          variable.type === "select" &&
          (!variable.options || variable.options.length === 0)
        ) {
          errors.variables = `Variable "${variable.name}" must have options for select type`;
        }
      });

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

  // Variable management
  const addVariable = useCallback(() => {
    const newVariable: PromptVariable = {
      id: crypto.randomUUID(),
      name: "",
      type: "text",
      required: false,
    };

    handleFieldChange("variables", [
      ...(editorState.currentPrompt?.variables || []),
      newVariable,
    ]);
  }, [editorState.currentPrompt?.variables, handleFieldChange]);

  const removeVariable = useCallback(
    (variableId: string) => {
      const updatedVariables =
        editorState.currentPrompt?.variables?.filter(
          (v) => v.id !== variableId
        ) || [];
      handleFieldChange("variables", updatedVariables);
    },
    [editorState.currentPrompt?.variables, handleFieldChange]
  );

  const updateVariable = useCallback(
    (variableId: string, updates: Partial<PromptVariable>) => {
      const updatedVariables =
        editorState.currentPrompt?.variables?.map((v) =>
          v.id === variableId ? { ...v, ...updates } : v
        ) || [];
      handleFieldChange("variables", updatedVariables);
    },
    [editorState.currentPrompt?.variables, handleFieldChange]
  );

  // Tag management
  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag || editorState.currentPrompt?.tags.includes(trimmedTag))
        return;

      const updatedTags = [
        ...(editorState.currentPrompt?.tags || []),
        trimmedTag,
      ];
      handleFieldChange("tags", updatedTags);
      setNewTag("");
    },
    [editorState.currentPrompt?.tags, handleFieldChange]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags =
        editorState.currentPrompt?.tags?.filter((tag) => tag !== tagToRemove) ||
        [];
      handleFieldChange("tags", updatedTags);
    },
    [editorState.currentPrompt?.tags, handleFieldChange]
  );

  // Preview generation
  const generatePreview = useCallback(
    (content: string, variables: PromptVariable[]) => {
      let preview = content;

      variables.forEach((variable) => {
        const placeholder = `{{${variable.name}}}`;
        const value = variable.defaultValue || `[${variable.name}]`;
        preview = preview.replace(new RegExp(placeholder, "g"), String(value));
      });

      return preview;
    },
    []
  );

  // Save handlers
  const handleSave = useCallback(async () => {
    if (!editorState.currentPrompt) return;

    const errors = validateForm(editorState.currentPrompt);

    if (Object.keys(errors).length > 0) {
      setEditorState((prev) => ({
        ...prev,
        validationErrors: errors,
      }));
      toast.error("Please fix validation errors before saving");
      return;
    }

    try {
      setEditorState((prev) => ({ ...prev, isLoading: true }));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { authorName, ...promptData } = editorState.currentPrompt;
      await onSave(promptData);

      setEditorState((prev) => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date(),
        isLoading: false,
        validationErrors: {},
      }));

      toast.success("Prompt saved successfully");
    } catch (error) {
      setEditorState((prev) => ({ ...prev, isLoading: false }));
      toast.error("Failed to save prompt");
      console.error("Save error:", error);
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

  // Auto-save implementation
  useEffect(() => {
    if (!editorState.isDirty || !editorState.currentPrompt || isSaving) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        const errors = validateForm(editorState.currentPrompt);
        if (Object.keys(errors).length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { authorName, ...promptData } = editorState.currentPrompt;
          await onSave(promptData);
          setEditorState((prev) => ({
            ...prev,
            isDirty: false,
            lastSaved: new Date(),
          }));
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [
    editorState.isDirty,
    editorState.currentPrompt,
    onSave,
    validateForm,
    isSaving,
  ]);

  // Memoized preview content
  const previewContent = useMemo(() => {
    if (!editorState.currentPrompt) return "";
    return generatePreview(
      editorState.currentPrompt.content,
      editorState.currentPrompt.variables || []
    );
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
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={editorState.isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={editorState.isLoading || isSaving}
              >
                {editorState.isLoading || isSaving ? (
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
                    placeholder="Enter your prompt content here. Use {{variable_name}} for variables."
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

              {/* Tags */}
              <div className="space-y-4">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editorState.currentPrompt.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(newTag);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {editorState.validationErrors.tags && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {editorState.validationErrors.tags}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="border-t border-border my-4" />

              {/* Variables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Variables</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariable}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>

                {!editorState.currentPrompt.variables ||
                editorState.currentPrompt.variables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No variables defined. Add variables to make your prompt
                    dynamic.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editorState.currentPrompt.variables?.map(
                      (variable, index) => (
                        <Card key={variable.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">
                                Variable {index + 1}
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVariable(variable.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`var-name-${variable.id}`}>
                                  Name
                                </Label>
                                <Input
                                  id={`var-name-${variable.id}`}
                                  placeholder="variable_name"
                                  value={variable.name}
                                  onChange={(e) =>
                                    updateVariable(variable.id, {
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`var-type-${variable.id}`}>
                                  Type
                                </Label>
                                <Select
                                  value={variable.type}
                                  onValueChange={(value) =>
                                    updateVariable(variable.id, {
                                      type: value as VariableType,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {VARIABLE_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() +
                                          type.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`var-default-${variable.id}`}>
                                  Default Value
                                </Label>
                                <Input
                                  id={`var-default-${variable.id}`}
                                  placeholder="Optional default"
                                  value={variable.defaultValue || ""}
                                  onChange={(e) =>
                                    updateVariable(variable.id, {
                                      defaultValue: e.target.value || undefined,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            {variable.type === "select" && (
                              <div className="space-y-2">
                                <Label>Options (comma-separated)</Label>
                                <Input
                                  placeholder="Option 1, Option 2, Option 3"
                                  value={variable.options?.join(", ") || ""}
                                  onChange={(e) =>
                                    updateVariable(variable.id, {
                                      options: e.target.value
                                        .split(",")
                                        .map((opt) => opt.trim())
                                        .filter(Boolean),
                                    })
                                  }
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`var-required-${variable.id}`}
                                checked={variable.required}
                                onCheckedChange={(checked) =>
                                  updateVariable(variable.id, {
                                    required: !!checked,
                                  })
                                }
                              />
                              <Label htmlFor={`var-required-${variable.id}`}>
                                Required
                              </Label>
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                )}

                {editorState.validationErrors.variables && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {editorState.validationErrors.variables}
                    </AlertDescription>
                  </Alert>
                )}
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
                    {editorState.currentPrompt.isPublic ? "Public" : "Private"}
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  {editorState.currentPrompt.isPublic
                    ? "This prompt will be visible to all users"
                    : "This prompt will only be visible to you"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Live Preview</Label>
                  <Badge variant="outline">
                    {editorState.currentPrompt.variables?.length || 0} variables
                  </Badge>
                </div>

                {(editorState.currentPrompt.variables?.length || 0) > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Variables are shown with their default values or
                      placeholders:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {editorState.currentPrompt.variables?.map((variable) => (
                        <Badge
                          key={variable.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {variable.name}:{" "}
                          {variable.defaultValue || `[${variable.name}]`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {previewContent || "No content to preview"}
                  </div>
                </div>

                {editorState.currentPrompt.content && !previewContent && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Preview could not be generated. Check your prompt content
                      and variables.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between text-sm text-gray-500 border-t">
          <div className="flex items-center gap-4">
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
          </div>

          <div className="text-xs">
            {editorState.currentPrompt.content.length} characters
          </div>
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
