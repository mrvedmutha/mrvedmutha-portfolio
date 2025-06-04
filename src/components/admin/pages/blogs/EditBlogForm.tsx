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
import { z } from "zod";
import { addTag, removeTag, handleAddTag } from "@/utils/blog/tag.utils";
import { handleAddCategory, getAncestorIds } from "@/utils/blog/category.utils";
import PostDescription from "@/components/admin/pages/blogs/components/PostDescription";
import CancelSaveButtons from "@/components/admin/pages/blogs/components/CancelSaveButtons";
import CategorySelector from "./components/CategorySelector";
import TagSelector from "./components/TagSelector";
import MainImageSelector from "./components/MainImageSelector";
import StatusSelector from "./components/StatusSelector";
import AuthorSelector from "./components/AuthorSelector";

type BlogFormType = z.infer<typeof BlogZod>;

export default function EditBlogForm({ blogId }: { blogId: string }) {
  const [showHtml, setShowHtml] = React.useState(false);
  const [htmlEdit, setHtmlEdit] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Data for dropdowns
  const [authors, setAuthors] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [tags, setTags] = React.useState<any[]>([]);

  // Sidebar state and handlers
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

  // Fetch blog data and dropdowns on mount
  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch blog
        const blogRes = await axios.get(`/api/v1/admin/blogs/${blogId}`);
        const blog = blogRes.data.data || blogRes.data;
        setStatus(blog.status);
        setAuthorId(blog.author?._id || "");
        setAllowComments(blog.allowComments);
        setSelectedCategories(blog.categories?.map((c: any) => c.id) || []);
        setSelectedTags(blog.tags?.map((t: any) => t.id) || []);
        setMainImage(blog.mainImage || "");
        setPassword(blog.password || "");
        setIsPasswordProtected(blog.isPasswordProtected || false);
        setScheduledDate(
          blog.scheduledDate ? new Date(blog.scheduledDate) : undefined
        );
        setScheduledHour(blog.scheduledHour || "");
        setScheduledMinute(blog.scheduledMinute || "");
        setScheduledPeriod(blog.scheduledPeriod || "");
        form.reset({
          ...blog,
          author: blog.author || { name: "", email: "", avatarUrl: "" },
        });
      } catch (e: any) {
        toast({
          title: "Failed to fetch blog",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Fetch dropdowns
    fetchAuthors();
    axios.get("/api/v1/admin/blogs/category").then((res) => {
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
    });
    axios
      .get("/api/v1/admin/blogs/tags")
      .then((res) => setTags(res.data.data || res.data));
  }, [blogId]);

  const form = useForm<z.infer<typeof BlogZod>>({
    resolver: zodResolver(BlogZod),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      status: BlogStatus.DRAFT,
      author: { name: "", email: "", avatarUrl: "" },
      allowComments: true,
      categories: [],
      tags: [],
      comments: [],
      mainImage: "",
    },
  });
  const { control, handleSubmit, setValue, getValues, formState, reset } = form;

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
        return prev.filter((c) => c !== id);
      } else {
        const ancestors = getAncestorIds(id, categories);
        return Array.from(new Set([...prev, id, ...ancestors]));
      }
    });
  };

  // Fetchers
  const fetchCategories = async () => {
    const res = await axios.get("/api/v1/admin/blogs/category");
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

  // Save handler (sidebar)
  const handleSidebarSave = () => {
    onSidebarSave();
  };
  const handleCancel = () => {
    router.push("/admin/blogs");
  };
  const onSidebarSave = async () => {
    setLoading(true);
    try {
      const values = getValues();
      let slug = values.slug;
      if (!slug) {
        slug = generateSlug(values.title);
      }
      const payload = {
        ...values,
        slug,
        mainImage,
        author: authorId
          ? {
              name: authors.find((a) => a._id === authorId)?.name || "",
              email: authors.find((a) => a._id === authorId)?.email || "",
              avatarUrl:
                authors.find((a) => a._id === authorId)?.avatarUrl || "",
            }
          : undefined,
        tags: selectedTags
          .map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag
              ? {
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                }
              : null;
          })
          .filter(Boolean),
        categories: selectedCategories
          .map((catId) => {
            const category = categories.find((c) => c.id === catId);
            return category
              ? {
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                  parentId: category.parentId,
                }
              : null;
          })
          .filter(Boolean),
        status,
        allowComments,
        scheduledDate,
        scheduledHour,
        scheduledMinute,
        scheduledPeriod,
        isPasswordProtected,
        password,
      };
      await axios.patch(`/api/v1/admin/blogs/${blogId}`, payload);
      toast({
        title: "Blog updated!",
        description: "Your blog post has been updated.",
      });
      router.push("/admin/blogs");
    } catch (error: any) {
      toast({
        title: "Failed to update blog",
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
        <h1 className="text-2xl font-bold mb-6">Edit blog</h1>
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
            saveLabel="Update"
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
          <AuthorSelector
            authors={authors}
            authorId={authorId}
            setAuthorId={setAuthorId}
            addAuthorLoading={addAuthorLoading}
            onAddAuthor={onAddAuthor}
          />
        </div>
      </div>
    </div>
  );
}
