# PromptBuilder Component Refactor Instructions

## Context
You are refactoring the `PromptBuilder.tsx` component for a prompt management application. The current component has structural issues and needs to be rebuilt using the new canonical type system.

## Requirements

### Core Functionality
The PromptBuilder component should provide:
1. **Form-based prompt creation/editing** with real-time validation
2. **Live preview** of the prompt with variable substitution
3. **Variable management** (add, edit, remove dynamic variables)
4. **Category and tag selection**
5. **Public/private visibility toggle**
6. **Auto-save functionality** with dirty state tracking
7. **Responsive design** that works on mobile and desktop

### Technical Requirements

#### Type System
Use the following types from the canonical type system:

```typescript
import { 
  DatabasePrompt, 
  PromptCategory, 
  PromptVariable, 
  PromptFormData,
  User 
} from '@/lib/types';
import { PromptEditorState } from '@/lib/types/ui-states.types';
```

#### Component Interface
```typescript
interface PromptBuilderProps {
  /** Initial prompt data to edit, if any */
  initialPrompt?: Partial<DatabasePrompt>;
  /** Callback when the prompt is saved */
  onSave: (prompt: Omit<PromptFormData, 'authorName'>) => Promise<void>;
  /** Callback when the form is cancelled */
  onCancel: () => void;
  /** Current user session */
  user?: User | null;
  /** Loading state for save operations */
  isSaving?: boolean;
}
```

#### State Management
Use the `PromptEditorState` interface for component state:

```typescript
const [editorState, setEditorState] = useState<PromptEditorState>({
  currentPrompt: null,
  isDirty: false,
  isLoading: false,
  lastSaved: undefined,
  validationErrors: {}
});
```

### UI/UX Requirements

#### Layout Structure
1. **Header Section**: Title, save/cancel buttons, dirty state indicator
2. **Main Content**: Tabbed interface with "Edit" and "Preview" tabs
3. **Edit Tab**: Form fields for all prompt properties
4. **Preview Tab**: Live preview with variable substitution
5. **Footer**: Auto-save status, last saved timestamp

#### Form Fields
1. **Title** (required): Text input with validation
2. **Description** (optional): Textarea for prompt description
3. **Content** (required): Large textarea for main prompt content
4. **Category** (required): Dropdown select with predefined categories
5. **Tags** (optional): Tag input with add/remove functionality
6. **Variables** (optional): Dynamic list of variable definitions
7. **Visibility** (required): Toggle for public/private
8. **Author Name** (optional): Text input for display name

#### Variable Management
- **Add Variable**: Button to add new variable definitions
- **Variable Types**: Support text, number, select, multiline
- **Variable Options**: For select type, allow multiple options
- **Default Values**: Optional default values for variables
- **Required Flag**: Mark variables as required/optional

#### Validation Rules
1. **Title**: Required, 1-200 characters
2. **Content**: Required, minimum 10 characters
3. **Category**: Required, must be valid category
4. **Variables**: Unique names, valid types
5. **Tags**: Maximum 10 tags, each 1-50 characters

### Implementation Guidelines

#### State Updates
```typescript
const handleFieldChange = useCallback(<T extends keyof PromptFormData>(
  field: T, 
  value: PromptFormData[T]
) => {
  setEditorState(prev => ({
    ...prev,
    isDirty: true,
    currentPrompt: {
      ...prev.currentPrompt!,
      [field]: value
    },
    validationErrors: {
      ...prev.validationErrors,
      [field]: '' // Clear error when user types
    }
  }));
}, []);
```

#### Variable Management
```typescript
const addVariable = useCallback(() => {
  const newVariable: PromptVariable = {
    id: crypto.randomUUID(),
    name: '',
    type: 'text',
    required: false
  };
  
  handleFieldChange('variables', [
    ...(editorState.currentPrompt?.variables || []),
    newVariable
  ]);
}, [editorState.currentPrompt?.variables, handleFieldChange]);
```

#### Preview Generation
```typescript
const generatePreview = useCallback((content: string, variables: PromptVariable[]) => {
  let preview = content;
  
  variables.forEach(variable => {
    const placeholder = `{{${variable.name}}}`;
    const value = variable.defaultValue || `[${variable.name}]`;
    preview = preview.replace(new RegExp(placeholder, 'g'), String(value));
  });
  
  return preview;
}, []);
```

#### Auto-save Implementation
```typescript
useEffect(() => {
  if (!editorState.isDirty || !editorState.currentPrompt) return;
  
  const autoSaveTimer = setTimeout(async () => {
    try {
      await onSave(editorState.currentPrompt);
      setEditorState(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date()
      }));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 2000); // Auto-save after 2 seconds of inactivity
  
  return () => clearTimeout(autoSaveTimer);
}, [editorState.isDirty, editorState.currentPrompt, onSave]);
```

### Component Structure

```typescript
export function PromptBuilder({
  initialPrompt = {},
  onSave,
  onCancel,
  user,
  isSaving = false
}: PromptBuilderProps) {
  // State management
  const [editorState, setEditorState] = useState<PromptEditorState>({...});
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Handlers
  const handleFieldChange = useCallback(...);
  const handleSave = useCallback(...);
  const handleCancel = useCallback(...);
  const addVariable = useCallback(...);
  const removeVariable = useCallback(...);
  const updateVariable = useCallback(...);
  
  // Effects
  useEffect(() => {
    // Initialize from initialPrompt
  }, [initialPrompt]);
  
  useEffect(() => {
    // Auto-save logic
  }, [editorState.isDirty]);
  
  // Render
  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <CardHeader>
        {/* Title, save/cancel buttons, dirty indicator */}
      </CardHeader>
      
      {/* Main Content */}
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            {/* Form fields */}
          </TabsContent>
          
          <TabsContent value="preview">
            {/* Live preview */}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Footer */}
      <CardFooter>
        {/* Auto-save status, last saved */}
      </CardFooter>
    </Card>
  );
}
```

### UI Components to Use

Use these Shadcn/UI components:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Input`, `Textarea`, `Label`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Button`, `Checkbox`
- `Badge` (for tags)
- `Separator`
- `Alert`, `AlertDescription` (for validation errors)

### Error Handling

1. **Validation Errors**: Display inline with form fields
2. **Save Errors**: Show toast notifications
3. **Network Errors**: Graceful degradation with retry options
4. **Data Loss Prevention**: Warn before navigation if dirty

### Accessibility

1. **Keyboard Navigation**: Full keyboard support
2. **Screen Readers**: Proper ARIA labels and descriptions
3. **Focus Management**: Logical tab order
4. **Error Announcements**: Screen reader friendly error messages

### Performance Considerations

1. **Debounced Auto-save**: Prevent excessive API calls
2. **Memoized Callbacks**: Prevent unnecessary re-renders
3. **Optimistic Updates**: Update UI immediately, sync later
4. **Large Content Handling**: Efficient textarea rendering

### Testing Considerations

Include these test scenarios:
1. **Form Validation**: All validation rules
2. **Auto-save**: Timing and error handling
3. **Variable Management**: Add, edit, remove variables
4. **Preview Generation**: Variable substitution
5. **Navigation Guards**: Prevent data loss
6. **Accessibility**: Keyboard and screen reader support

### File Location
Place the refactored component at:
`src/components/prompts/PromptBuilder.tsx`

### Dependencies
Ensure these are installed:
```json
{
  "next-auth": "^4.x.x",
  "date-fns": "^2.x.x",
  "lucide-react": "^0.x.x"
}
```

---

## Success Criteria

The refactored component should:
1. ✅ Compile without TypeScript errors
2. ✅ Use only canonical types from the type system
3. ✅ Provide all required functionality
4. ✅ Handle nullable fields correctly (description, authorName, etc.)
5. ✅ Implement proper validation and error handling
6. ✅ Be fully accessible and responsive
7. ✅ Include comprehensive error boundaries
8. ✅ Support auto-save with dirty state tracking

---

*Use this prompt in your AI workspace to generate a complete, production-ready PromptBuilder component.*
