"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogZod } from "@/schemas/zod/admin/blogs/blog.zod";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { addTag, removeTag, handleAddTag } from "@/utils/blog/tag.utils";
import { handleAddCategory } from "@/utils/blog/category.utils";
import PostDescription from "@/components/admin/pages/blogs/components/PostDescription";
import CancelSaveButtons from "@/components/admin/pages/blogs/components/CancelSaveButtons";
import CategorySelector from "@/components/admin/pages/blogs/components/CategorySelector";
import TagSelector from "@/components/admin/pages/blogs/components/TagSelector";
import MainImageSelector from "@/components/admin/pages/blogs/components/MainImageSelector";
import StatusSelector from "@/components/admin/pages/blogs/components/StatusSelector";
import AuthorSelector from "@/components/admin/pages/blogs/components/AuthorSelector";

type BlogFormType = z.infer<typeof BlogZod>;

const defaultValues: BlogFormType = {
  title: "",
  slug: "",
  description: "",
  status: BlogStatus.DRAFT,
  author: "",
  allowComments: true,
  categories: [],
  tags: [],
  comments: [],
  mainImage: "",
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
  const [scheduledPeriod, setScheduledPeriod] = React.useState("");
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
  const [addAuthorLoading, setAddAuthorLoading] = React.useState(false);

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
  const fetchAuthors = async () => {
    const res = await axios.get("/api/v1/admin/blogs/authors");
    setAuthors(res.data.data || res.data);
  };

  React.useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchAuthors();
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
  const onAddTag = (tag: string) => addTag(tag, selectedTags, setSelectedTags);
  const onRemoveTag = (tag: string) =>
    removeTag(tag, selectedTags, setSelectedTags);
  const onHandleAddTag = () =>
    handleAddTag({ tagInput, setAddTagLoading, setTagInput, fetchTags });

  // Category handler
  const onHandleAddCategory = () =>
    handleAddCategory({
      newCategoryName,
      setAddCategoryLoading,
      setNewCategoryName,
      setParentCategoryId,
      setShowAddCategory,
      parentCategoryId,
      fetchCategories,
    });

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

  // Save handler (sidebar)
  const handleSidebarSave = () => {
    // Compose sidebar data
    const sidebarData = {
      status,
      author: authorId,
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
      const payload = { ...values, ...sidebarData, slug, mainImage };
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

  const onAddAuthor = async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    setAddAuthorLoading(true);
    try {
      const res = await axios.post("/api/v1/admin/blogs/authors/create", {
        name,
        email,
      });
      await fetchAuthors();
      setAuthorId(res.data.data._id);
    } catch (e) {
      // Optionally show error toast
      toast({
        title: "Error",
        description: "Failed to add author",
        variant: "destructive",
      });
    } finally {
      setAddAuthorLoading(false);
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
        <PostDescription
          value={getValues("description")}
          onChange={(val) => setValue("description", val)}
          showHtml={showHtml}
          setShowHtml={setShowHtml}
          htmlEdit={htmlEdit}
          setHtmlEdit={setHtmlEdit}
          handleSaveHtml={handleSaveHtml}
        />
      </div>
      {/* Sidebar (20%) */}
      <div className="w-1/5 min-w-[300px] max-w-[350px] p-8">
        <div className="w-full flex flex-col gap-6">
          {/* Cancel/Save Buttons with AlertDialog for Cancel */}
          <CancelSaveButtons
            onCancel={handleCancel}
            onSave={handleSidebarSave}
            loading={loading}
            saveLabel="Save"
          />
          {/* Post Status Dropdown */}
          <div className="mb-8">
            <StatusSelector
              status={status}
              setStatus={setStatus}
              allowComments={allowComments}
              setAllowComments={setAllowComments}
              isPasswordProtected={isPasswordProtected}
              setIsPasswordProtected={setIsPasswordProtected}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledHour={scheduledHour}
              setScheduledHour={setScheduledHour}
              scheduledMinute={scheduledMinute}
              setScheduledMinute={setScheduledMinute}
              scheduledPeriod={scheduledPeriod}
              setScheduledPeriod={setScheduledPeriod}
              password={password}
              setPassword={setPassword}
              popoverOpen={popoverOpen}
              setPopoverOpen={setPopoverOpen}
            />
          </div>
          {/* Main Image */}
          <div className="mb-6">
            <MainImageSelector
              mainImage={mainImage}
              setMainImage={setMainImage}
            />
          </div>
          {/* Category Accordion */}
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            showAddCategory={showAddCategory}
            setShowAddCategory={setShowAddCategory}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            parentCategoryId={parentCategoryId}
            setParentCategoryId={setParentCategoryId}
            addCategoryLoading={addCategoryLoading}
            onHandleAddCategory={onHandleAddCategory}
          />
          {/* Tag Accordion */}
          <Accordion type="single" collapsible>
            <AccordionItem value="tag">
              <AccordionTrigger>Tags</AccordionTrigger>
              <AccordionContent>
                <TagSelector
                  tags={tags}
                  selectedTags={selectedTags}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  addTagLoading={addTagLoading}
                  onHandleAddTag={onHandleAddTag}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <AuthorSelector authorId={authorId} setAuthorId={setAuthorId} />
        </div>
      </div>
    </div>
  );
}
