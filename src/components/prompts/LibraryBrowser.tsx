// // src/components/prompts/LibraryBrowser.tsx
// "use client";

// import { useState, useMemo } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Search, X, ChevronRight } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { PromptFormData, PromptCategory } from "@/lib/types/prompt.types";

// interface Category {
//   id: PromptCategory;
//   name: string;
//   color?: string;
// }

// interface LibraryBrowserProps {
//   categories: Category[];
//   instructions: PromptFormData[];
//   onSelect: (instruction: PromptFormData) => void;
// }

// const CATEGORY_COLORS: Record<string, string> = {
//   system: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
//   user: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50",
//   assistant: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
//   function: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
// };

// export function LibraryBrowser({
//   categories,
//   instructions,
//   onSelect,
// }: LibraryBrowserProps) {
//   const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "all">("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredInstructions = useMemo(() => {
//     return instructions.filter((instruction) => {
//       const matchesCategory = selectedCategory === "all" || instruction.category === selectedCategory;
//       const matchesSearch = instruction.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          instruction.title?.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [instructions, selectedCategory, searchQuery]);

//   const handleClearFilters = () => {
//     setSelectedCategory("all");
//     setSearchQuery("");
//   };

//   return (
//     <Card className="w-full h-[600px] flex flex-col border-border/50 bg-background/80 dark:bg-background/80">
//       <CardHeader className="pb-3 border-b border-border/30">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-xl font-semibold text-foreground">Prompt Library</CardTitle>
//           <div className="flex items-center gap-2">
//             {(selectedCategory !== "all" || searchQuery) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-3.5 w-3.5 mr-1" />
//                 Clear filters
//               </Button>
//             )}
//             <Select
//               value={selectedCategory}
//               onValueChange={(value) => setSelectedCategory(value as PromptCategory | "all")}
//             >
//               <SelectTrigger className="w-[180px] h-8 text-sm">
//                 <SelectValue placeholder="Filter by category" />
//               </SelectTrigger>
//               <SelectContent align="end" className="min-w-[180px]">
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((category) => (
//                   <SelectItem key={category.id} value={category.id}>
//                     {category.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="relative mt-3">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search prompts by title or content..."
//             className="pl-9 h-9 bg-background/80"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </CardHeader>

//       <CardContent className="flex-1 p-0 overflow-hidden">
//         {filteredInstructions.length > 0 ? (
//           <ScrollArea className="h-full w-full">
//             <div className="p-4 space-y-3">
//               {filteredInstructions.map((instruction) => (
//                 <Card
//                   key={instruction.id}
//                   className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden bg-card/80 hover:bg-card"
//                   onClick={() => onSelect(instruction)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="space-y-1.5 flex-1">
//                         <h4 className="font-medium text-foreground line-clamp-1">
//                           {instruction.title || 'Untitled Prompt'}
//                         </h4>
//                         <p className="text-sm text-muted-foreground line-clamp-2 font-mono">
//                           {instruction.content}
//                         </p>
//                         <div className="flex items-center gap-2 pt-2">
//                           <Badge
//                             variant="outline"
//                             className={`text-xs font-normal ${
//                               CATEGORY_COLORS[instruction.category] || 'bg-secondary/50 text-secondary-foreground'
//                             }`}
//                           >
//                             {instruction.category}
//                           </Badge>
//                           {instruction.tags?.slice(0, 2).map(tag => (
//                             <Badge
//                               key={tag}
//                               variant="secondary"
//                               className="text-xs font-normal"
//                             >
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                       <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center p-8 text-center">
//             <div className="flex flex-col items-center justify-center rounded-full h-16 w-16 bg-muted mb-4">
//               <Search className="h-6 w-6 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-medium text-foreground mb-1">No prompts found</h3>
//             <p className="text-sm text-muted-foreground max-w-md">
//               {searchQuery || selectedCategory !== 'all'
//                 ? 'Try adjusting your search or filter criteria.'
//                 : 'The prompt library is currently empty.'}
//             </p>
//             {(searchQuery || selectedCategory !== 'all') && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="mt-3"
//               >
//                 Clear all filters
//               </Button>
//             )}
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="border-t border-border/30 py-3 px-4">
//         <div className="w-full flex items-center justify-between">
//           <p className="text-xs text-muted-foreground">
//             {filteredInstructions.length} {filteredInstructions.length === 1 ? 'prompt' : 'prompts'} found
//           </p>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-muted-foreground">
//               {selectedCategory !== 'all' && `Category: ${categories.find(c => c.id === selectedCategory)?.name}`}
//             </span>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
