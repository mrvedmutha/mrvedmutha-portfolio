"use client";
import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function buildCategoryTree(categories: any[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  categories.forEach((cat: any) => {
    map[cat.id] = { ...cat, children: [] };
  });
  categories.forEach((cat: any) => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });
  return roots;
}
function renderCategoryCheckboxes(
  categories: any[],
  selectedCategories: number[],
  toggleCategory: (id: number) => void,
  depth = 0
): React.ReactNode {
  return categories.map((cat: any) => (
    <React.Fragment key={cat.id}>
      <div
        className="flex items-center gap-2"
        style={{ marginLeft: depth * 16 }}
      >
        <Checkbox
          id={String(cat.id)}
          checked={selectedCategories.includes(cat.id)}
          onCheckedChange={() => toggleCategory(cat.id)}
        />
        <label htmlFor={String(cat.id)}>{cat.name}</label>
      </div>
      {cat.children &&
        cat.children.length > 0 &&
        renderCategoryCheckboxes(
          cat.children,
          selectedCategories,
          toggleCategory,
          depth + 1
        )}
    </React.Fragment>
  ));
}
function renderCategoryOptions(
  categories: any[],
  depth = 0
): React.ReactNode[] {
  return categories.flatMap((cat: any) => [
    <SelectItem key={cat.id} value={cat.id} style={{ marginLeft: depth * 16 }}>
      {cat.name}
    </SelectItem>,
    ...(cat.children && cat.children.length > 0
      ? renderCategoryOptions(cat.children, depth + 1)
      : []),
  ]);
}

interface CategorySelectorProps {
  categories: any[];
  selectedCategories: number[];
  toggleCategory: (id: number) => void;
  showAddCategory: boolean;
  setShowAddCategory: (v: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  parentCategoryId: string;
  setParentCategoryId: (v: string) => void;
  addCategoryLoading: boolean;
  onHandleAddCategory: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  showAddCategory,
  setShowAddCategory,
  newCategoryName,
  setNewCategoryName,
  parentCategoryId,
  setParentCategoryId,
  addCategoryLoading,
  onHandleAddCategory,
}) => (
  <Accordion type="single" collapsible className="mb-4">
    <AccordionItem value="category">
      <AccordionTrigger>Categories</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4">
          <div className="max-h-40 overflow-y-auto p-2 border rounded bg-muted/20 flex flex-col gap-2">
            {renderCategoryCheckboxes(
              buildCategoryTree(categories),
              selectedCategories,
              toggleCategory
            )}
          </div>
          {/* Add Category Section */}
          {!showAddCategory ? (
            <Button
              size="sm"
              className="w-full"
              onClick={() => setShowAddCategory(true)}
            >
              Add Category
            </Button>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full"
              />
              <Select
                value={parentCategoryId || "none"}
                onValueChange={(val) =>
                  setParentCategoryId(val === "none" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {renderCategoryOptions(buildCategoryTree(categories))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  variant="outline"
                  onClick={() => setShowAddCategory(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={onHandleAddCategory}
                  disabled={addCategoryLoading}
                >
                  {addCategoryLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default CategorySelector;
