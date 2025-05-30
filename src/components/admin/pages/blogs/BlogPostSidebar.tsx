"use client";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BlogPostSidebar({
  authors = [],
  categories = [],
  tags = [],
  loading = false,
  onSave,
  onCategoryAdded,
  onTagAdded,
}: {
  authors: any[];
  categories: any[];
  tags: any[];
  loading: boolean;
  onSave: (data: any) => void;
  onCategoryAdded: () => void;
  onTagAdded: () => void;
}) {
  const router = useRouter();
  // Sidebar state
  const [status, setStatus] = useState<BlogStatus>(BlogStatus.DRAFT);
  const [authorId, setAuthorId] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Scheduling
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [scheduledHour, setScheduledHour] = useState("");
  const [scheduledMinute, setScheduledMinute] = useState("");
  const [scheduledPeriod, setScheduledPeriod] = useState("AM");
  const [popoverOpen, setPopoverOpen] = useState(false);
  // Password protection
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  // Tag input
  const [tagInput, setTagInput] = useState("");
  // Add Category state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  // Tag add button state
  const [addTagLoading, setAddTagLoading] = useState(false);

  // Tag handlers
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag))
      setSelectedTags([...selectedTags, tag]);
  };
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Category handlers
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Add Category handler
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddCategoryLoading(true);
    try {
      const id = newCategoryName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      await axios.post("/api/v1/admin/blogs/category/create", {
        id,
        name: newCategoryName.trim(),
        parentId: parentCategoryId || null,
      });
      setNewCategoryName("");
      setParentCategoryId("");
      setShowAddCategory(false);
      if (onCategoryAdded) onCategoryAdded();
    } catch (e) {
      // Optionally show error toast
    } finally {
      setAddCategoryLoading(false);
    }
  };

  // Tag add handler
  const handleAddTag = async () => {
    if (!tagInput.trim()) return;
    setAddTagLoading(true);
    try {
      const id = tagInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      await axios.post("/api/v1/admin/blogs/tags/create", {
        id,
        name: tagInput.trim(),
      });
      addTag(id);
      setTagInput("");
      if (onTagAdded) onTagAdded();
    } catch (e) {
      // Optionally show error toast
    } finally {
      setAddTagLoading(false);
    }
  };

  // Save handler
  const handleSave = () => {
    // Compose sidebar data
    const sidebarData = {
      status,
      author: authors.find((a) => a._id === authorId),
      allowComments,
      categories: categories.filter((c) => selectedCategories.includes(c.id)),
      tags: tags.filter((t) => selectedTags.includes(t.id)),
      scheduledDate,
      scheduledHour,
      scheduledMinute,
      scheduledPeriod,
      isPasswordProtected,
      password,
    };
    onSave(sidebarData);
  };

  // Cancel handler
  const handleCancel = () => {
    router.push("/admin/blogs");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cancel/Save Buttons with AlertDialog for Cancel */}
      <div className="flex gap-2 mb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ShadcnButton variant="outline" className="flex-1" type="button">
              Cancel
            </ShadcnButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to cancel?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Any information you have entered will not be restored.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Editing</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel}>
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ShadcnButton
          variant="default"
          className="flex-1"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </ShadcnButton>
      </div>
      {/* Post Status Dropdown */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as BlogStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BlogStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* If Private: Password */}
        {status === BlogStatus.PRIVATE && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="private-password"
                checked={isPasswordProtected}
                onCheckedChange={(checked) =>
                  setIsPasswordProtected(checked === true)
                }
              />
              <label htmlFor="private-password" className="text-sm">
                Password protected
              </label>
            </div>
            {isPasswordProtected && (
              <div className="flex gap-2">
                <ShadcnInput
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
        {/* If Scheduled: Popover for calendar and time */}
        {status === BlogStatus.SCHEDULED && (
          <div className="mt-6 w-full flex flex-col gap-4">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <ShadcnButton
                  variant="outline"
                  className="w-full justify-start"
                >
                  {scheduledDate
                    ? `${scheduledDate.toLocaleDateString()} ${scheduledHour}:${scheduledMinute} ${scheduledPeriod}`
                    : "Pick date & time"}
                </ShadcnButton>
              </PopoverTrigger>
              <PopoverContent className="min-w-[320px] w-auto p-4 flex flex-col gap-4">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  className="rounded-md border"
                />
                <div className="flex justify-center gap-4 items-center w-full">
                  <ShadcnInput
                    type="number"
                    min="1"
                    max="12"
                    placeholder="hh"
                    value={scheduledHour}
                    onChange={(e) =>
                      setScheduledHour(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-16 text-center"
                    maxLength={2}
                  />
                  <span className="text-lg font-semibold">:</span>
                  <ShadcnInput
                    type="number"
                    min="0"
                    max="59"
                    placeholder="mm"
                    value={scheduledMinute}
                    onChange={(e) =>
                      setScheduledMinute(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-16 text-center"
                    maxLength={2}
                  />
                  <select
                    value={scheduledPeriod}
                    onChange={(e) => setScheduledPeriod(e.target.value)}
                    className="border rounded px-2 py-1 text-sm focus:outline-none"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <ShadcnButton size="sm" onClick={() => setPopoverOpen(false)}>
                  Save
                </ShadcnButton>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {/* Author Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Author</label>
        <Select value={authorId} onValueChange={setAuthorId}>
          <SelectTrigger>
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((a) => (
              <SelectItem key={a._id} value={a._id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Discussion Checkbox */}
      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          id="allow-comments"
          checked={allowComments}
          onCheckedChange={(checked) => setAllowComments(checked === true)}
        />
        <label htmlFor="allow-comments" className="text-sm">
          Allow comments
        </label>
      </div>
      {/* Category Accordion */}
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="max-h-40 overflow-y-auto p-2 border rounded bg-muted/20 flex flex-col gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <Checkbox
                      id={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <label htmlFor={cat.id}>{cat.name}</label>
                  </div>
                ))}
              </div>
              {/* Add Category Section */}
              {!showAddCategory ? (
                <ShadcnButton
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAddCategory(true)}
                >
                  Add Category
                </ShadcnButton>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <ShadcnInput
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
                      <SelectItem value="none">None</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <ShadcnButton
                      size="sm"
                      className="flex-1"
                      variant="outline"
                      onClick={() => setShowAddCategory(false)}
                    >
                      Cancel
                    </ShadcnButton>
                    <ShadcnButton
                      size="sm"
                      className="flex-1"
                      onClick={handleAddCategory}
                      disabled={addCategoryLoading}
                    >
                      {addCategoryLoading ? "Saving..." : "Save"}
                    </ShadcnButton>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Tag Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="tag">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
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
                        onClick={() => removeTag(tag.id)}
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
                    if (
                      (e.key === "Enter" || e.key === ",") &&
                      tagInput.trim()
                    ) {
                      e.preventDefault();
                      const value = tagInput.trim().replace(/,$/, "");
                      if (value && !selectedTags.includes(value)) {
                        addTag(value);
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
                        addTag(tagInput.trim());
                        setTagInput("");
                      }}
                    >
                      Add "{tagInput.trim()}"
                    </CommandItem>
                  ) : (
                    tags
                      .filter(
                        (t) =>
                          t.name
                            .toLowerCase()
                            .includes(tagInput.toLowerCase()) &&
                          !selectedTags.includes(t.id)
                      )
                      .map((t) => (
                        <CommandItem
                          key={t.id}
                          onSelect={() => {
                            addTag(t.id);
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
                  <ShadcnButton
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleAddTag}
                    disabled={addTagLoading}
                  >
                    {addTagLoading
                      ? "Adding..."
                      : `Add "${tagInput.trim()}" as new tag`}
                  </ShadcnButton>
                )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
