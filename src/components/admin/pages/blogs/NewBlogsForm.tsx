"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogZod } from "@/schemas/zod/admin/blogs/blog.zod";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/ui/TipTapEditor";
import { CodeIcon } from "lucide-react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { z } from "zod";
import ImageDrawer from "@/components/common/admin/ImageDrawer";

type BlogFormType = z.infer<typeof BlogZod>;

const defaultValues: BlogFormType = {
  title: "",
  slug: "",
  description: "",
  status: BlogStatus.DRAFT,
  author: { _id: "", name: "", email: "", avatarUrl: "" },
  allowComments: true,
  categories: [],
  tags: [],
  comments: [],
};

// Utility to build a tree from flat categories
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

// Recursive render for checkbox list
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

// Recursive render for Select dropdown
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

// Utility to get all ancestor IDs for a category (number version)
function getAncestorIds(categoryId: number, categories: any[]): number[] {
  const map: Record<number, any> = {};
  categories.forEach((cat) => {
    map[cat.id] = cat;
  });
  const ancestors: number[] = [];
  let current = map[categoryId];
  while (current && current.parentId !== null && map[current.parentId]) {
    ancestors.push(current.parentId);
    current = map[current.parentId];
  }
  return ancestors;
}

export default function NewBlogsForm() {
  const [showHtml, setShowHtml] = React.useState(false);
  const [htmlEdit, setHtmlEdit] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Data for dropdowns
  const [authors, setAuthors] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [tags, setTags] = React.useState<any[]>([]);

  // Sidebar state and handlers (moved from BlogPostSidebar)
  const [status, setStatus] = React.useState(BlogStatus.DRAFT);
  const [authorId, setAuthorId] = React.useState("");
  const [allowComments, setAllowComments] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    []
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = React.useState<Date | undefined>(
    undefined
  );
  const [scheduledHour, setScheduledHour] = React.useState("");
  const [scheduledMinute, setScheduledMinute] = React.useState("");
  const [scheduledPeriod, setScheduledPeriod] = React.useState("AM");
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [parentCategoryId, setParentCategoryId] = React.useState("");
  const [addCategoryLoading, setAddCategoryLoading] = React.useState(false);
  const [addTagLoading, setAddTagLoading] = React.useState(false);
  const [mainImage, setMainImage] = React.useState<string>("");
  const [slugEditMode, setSlugEditMode] = React.useState(false);

  // Fetchers
  const fetchCategories = async () => {
    const res = await axios.get("/api/v1/admin/blogs/category");
    // Normalize parentId to number or null
    const normalized = (res.data.data || res.data).map((cat: any) => ({
      ...cat,
      parentId:
        cat.parentId !== null &&
        cat.parentId !== undefined &&
        cat.parentId !== ""
          ? Number(cat.parentId)
          : null,
      id: Number(cat.id),
    }));
    setCategories(normalized);
  };
  const fetchTags = async () => {
    const res = await axios.get("/api/v1/admin/blogs/tags");
    setTags(res.data.data || res.data);
  };

  React.useEffect(() => {
    fetchCategories();
    fetchTags();
    axios
      .get("/api/v1/admin/blogs/authors")
      .then((res) => setAuthors(res.data.data || res.data))
      .catch(() => setAuthors([]));
  }, []);

  const form = useForm<BlogFormType>({
    resolver: zodResolver(BlogZod),
    defaultValues,
  });

  const { control, handleSubmit, setValue, getValues, formState } = form;

  // HTML/TipTap toggle
  const handleShowHtml = () => {
    if (!showHtml) {
      setHtmlEdit(getValues("description") as string);
    }
    setShowHtml((v) => !v);
  };
  const handleSaveHtml = () => {
    setValue("description", htmlEdit);
    setShowHtml(false);
  };

  // Slug generator utility
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // Tag handlers
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag))
      setSelectedTags([...selectedTags, tag]);
  };
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Category handlers
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        // Uncheck only this category
        return prev.filter((c) => c !== id);
      } else {
        // Check this category and all ancestors
        const ancestors = getAncestorIds(id, categories);
        return Array.from(new Set([...prev, id, ...ancestors]));
      }
    });
  };

  // Add Category handler
  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    setAddCategoryLoading(true);
    try {
      await axios.post("/api/v1/admin/blogs/category/create", {
        name: newCategoryName,
        parentId: parentCategoryId || null,
      });
      setNewCategoryName("");
      setParentCategoryId("");
      setShowAddCategory(false);
      fetchCategories();
    } catch (e) {
      // Optionally show error toast
    } finally {
      setAddCategoryLoading(false);
    }
  };

  // Tag add handler
  const handleAddTag = async () => {
    if (!tagInput) return;
    setAddTagLoading(true);
    try {
      await axios.post("/api/v1/admin/blogs/tags/create", {
        name: tagInput,
      });
      setTagInput("");
      fetchTags();
    } catch (e) {
      // Optionally show error toast
    } finally {
      setAddTagLoading(false);
    }
  };

  // Save handler (sidebar)
  const handleSidebarSave = () => {
    // Compose sidebar data
    const sidebarData = {
      status,
      author: authors.find((a: any) => a._id === authorId),
      allowComments,
      categories: categories.filter((c: any) =>
        selectedCategories.includes(c.id)
      ),
      tags: tags.filter((t: any) => selectedTags.includes(t.id)),
      scheduledDate,
      scheduledHour,
      scheduledMinute,
      scheduledPeriod,
      isPasswordProtected,
      password,
    };
    onSidebarSave(sidebarData);
  };

  // Cancel handler
  const handleCancel = () => {
    router.push("/admin/blogs");
  };

  // Sidebar save handler
  const onSidebarSave = async (sidebarData: any) => {
    setLoading(true);
    try {
      const values = getValues();
      let slug = values.slug;
      if (!slug) {
        slug = generateSlug(values.title);
      }
      const payload = { ...values, ...sidebarData, slug };
      console.log("Blog create payload:", payload);
      await axios.post("/api/v1/admin/blogs/create", payload);
      toast({
        title: "Blog created!",
        description: "Your blog post has been added.",
      });
      router.push("/admin/blogs");
    } catch (error: any) {
      console.log("Blog create error:", error, error?.response?.data);
      toast({
        title: "Failed to create blog",
        description:
          error?.response?.data?.message || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content (80%) */}
      <div className="w-4/5 min-w-0 p-8">
        <h1 className="text-2xl font-bold mb-6">Create blog</h1>
        {/* Post Title */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-4"
            htmlFor="post-title"
          >
            Post Title
          </label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                id="post-title"
                {...field}
                placeholder="Post Title"
                className="text-2xl mb-2"
              />
            )}
          />
          {/* Slug with edit/save */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-4" htmlFor="post-slug">
              Slug
            </label>
            <div className="mt-2 flex items-center gap-2">
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Input
                    id="post-slug"
                    {...field}
                    className="flex-1 text-base"
                    style={{ minWidth: 0 }}
                    disabled={!slugEditMode}
                  />
                )}
              />
              {!slugEditMode ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSlugEditMode(true)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={() => setSlugEditMode(false)}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Post Description (Tiptap/HTML) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-4">
            Post Description
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
              variant={showHtml ? "default" : "outline"}
              onClick={handleShowHtml}
              aria-label="HTML"
              className="flex items-center gap-2 px-3"
            >
              <CodeIcon className="w-4 h-4" />
              <span className="ml-1 text-xs font-medium">edit as html</span>
            </Button>
          </div>
          <div className="border rounded min-h-[200px] p-4 bg-background">
            {showHtml ? (
              <div>
                <Editor
                  value={htmlEdit}
                  onValueChange={setHtmlEdit}
                  highlight={(code) =>
                    Prism.highlight(code, Prism.languages.markup, "markup")
                  }
                  padding={10}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    minHeight: 400,
                    background: "#18181b",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    color: "#f4f4f5",
                    whiteSpace: "pre",
                  }}
                  textareaId="html-code-editor"
                  textareaClassName="w-full h-[400px] resize-none focus:outline-none"
                  autoFocus
                  spellCheck={false}
                />
                <Button onClick={handleSaveHtml} className="mt-2">
                  Save
                </Button>
              </div>
            ) : (
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TipTapEditor
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    editorHeight={400}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>
      {/* Sidebar (20%) */}
      <div className="w-1/5 min-w-[300px] max-w-[350px] p-8">
        <div className="w-full flex flex-col gap-6">
          {/* Cancel/Save Buttons with AlertDialog for Cancel */}
          <div className="flex gap-2 mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1" type="button">
                  Cancel
                </Button>
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
            <Button
              variant="default"
              className="flex-1"
              onClick={handleSidebarSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
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
                    <Input
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
                    <Button variant="outline" className="w-full justify-start">
                      {scheduledDate
                        ? `${scheduledDate.toLocaleDateString()} ${scheduledHour}:${scheduledMinute} ${scheduledPeriod}`
                        : "Pick date & time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[320px] w-auto p-4 flex flex-col gap-4">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      className="rounded-md border"
                    />
                    <div className="flex justify-center gap-4 items-center w-full">
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        placeholder="hh"
                        value={scheduledHour}
                        onChange={(e) =>
                          setScheduledHour(
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        className="w-16 text-center"
                        maxLength={2}
                      />
                      <span className="text-lg font-semibold">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="mm"
                        value={scheduledMinute}
                        onChange={(e) =>
                          setScheduledMinute(
                            e.target.value.replace(/[^0-9]/g, "")
                          )
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
                    <Button size="sm" onClick={() => setPopoverOpen(false)}>
                      Save
                    </Button>
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
          {/* Main Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-4">
              Main Blog Image
            </label>
            <div className="aspect-[16/9] w-48 border rounded overflow-hidden mb-2">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <ImageDrawer
              value={mainImage}
              onChange={setMainImage}
              trigger={
                <Button variant="outline" className="mt-4">
                  {mainImage ? "Change Image" : "Select/Upload Image"}
                </Button>
              }
            />
          </div>
          {/* Category Accordion */}
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="category">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4">
                  <div className="max-h-40 overflow-y-auto p-2 border rounded bg-muted/20 flex flex-col gap-4">
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
                          onClick={handleAddCategory}
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
                          t.name
                            .toLowerCase()
                            .includes(tagInput.toLowerCase()) &&
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
                      (t) =>
                        t.name.toLowerCase() === tagInput.trim().toLowerCase()
                    ) && (
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={handleAddTag}
                        disabled={addTagLoading}
                      >
                        {addTagLoading
                          ? "Adding..."
                          : `Add "${tagInput.trim()}" as new tag`}
                      </Button>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
