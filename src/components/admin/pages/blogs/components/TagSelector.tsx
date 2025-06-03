"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { X } from "lucide-react";

interface TagSelectorProps {
  tags: any[];
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  addTagLoading: boolean;
  onHandleAddTag: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onAddTag,
  onRemoveTag,
  tagInput,
  setTagInput,
  addTagLoading,
  onHandleAddTag,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-wrap gap-2 mb-2">
      {selectedTags.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        return tag ? (
          <span
            key={tag.id}
            className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
          >
            {tag.name}
            <button
              type="button"
              className="ml-1 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveTag(tag.id)}
              aria-label={`Remove ${tag.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ) : null;
      })}
    </div>
    <Command>
      <CommandInput
        placeholder="Search or add tag..."
        value={tagInput}
        onValueChange={setTagInput}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
            e.preventDefault();
            const value = tagInput.trim().replace(/,$/, "");
            if (value && !selectedTags.includes(value)) {
              onAddTag(value);
              setTagInput("");
            }
          }
        }}
      />
      <CommandList className="max-h-48 overflow-y-auto">
        {tags.filter(
          (t) =>
            t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
            !selectedTags.includes(t.id)
        ).length === 0 && tagInput.trim() ? (
          <CommandItem
            onSelect={() => {
              onAddTag(tagInput.trim());
              setTagInput("");
            }}
          >
            Add &ldquo;{tagInput.trim()}&rdquo;
          </CommandItem>
        ) : (
          tags
            .filter(
              (t) =>
                t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                !selectedTags.includes(t.id)
            )
            .map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => {
                  onAddTag(t.id);
                  setTagInput("");
                }}
              >
                {t.name}
              </CommandItem>
            ))
        )}
      </CommandList>
    </Command>
    {/* Add Tag Button (if tagInput is not empty and not in tags) */}
    {tagInput.trim() &&
      !tags.some(
        (t) => t.name.toLowerCase() === tagInput.trim().toLowerCase()
      ) && (
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={onHandleAddTag}
          disabled={addTagLoading}
        >
          {addTagLoading ? "Adding..." : `Add "${tagInput.trim()}" as new tag`}
        </Button>
      )}
  </div>
);

export default TagSelector;
