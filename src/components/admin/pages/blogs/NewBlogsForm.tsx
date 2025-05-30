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
import BlogPostSidebar from "./BlogPostSidebar";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const defaultValues = {
  title: "",
  slug: "",
  description: "",
  status: BlogStatus.DRAFT,
  author: { _id: "", name: "", email: "" },
  allowComments: true,
  categories: [],
  tags: [],
};

export default function NewBlogsForm() {
  const [showHtml, setShowHtml] = React.useState(false);
  const [htmlEdit, setHtmlEdit] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Data for dropdowns
  const [authors, setAuthors] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  // Fetchers
  const fetchCategories = async () => {
    const res = await axios.get("/api/v1/admin/blogs/category");
    setCategories(res.data.data || res.data);
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

  const form = useForm({
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
      await axios.post("/api/v1/admin/blogs/create", payload);
      toast({
        title: "Blog created!",
        description: "Your blog post has been added.",
      });
      router.push("/admin/blogs");
    } catch (error: any) {
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
    <div className="flex gap-8">
      {/* Main Content (80%) */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold mb-6">Create blog</h1>
        {/* Post Title */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1"
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
          <div className="mt-2">
            <label
              className="block text-sm font-medium mb-1 text-muted-foreground"
              htmlFor="post-slug"
            >
              Slug
            </label>
            <div className="flex gap-2">
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Input
                    id="post-slug"
                    {...field}
                    className="flex-1 text-base"
                    style={{ minWidth: 0 }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        {/* Post Description (Tiptap/HTML) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Post Description
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
                    value={field.value}
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
      <div className="w-[350px]">
        <BlogPostSidebar
          authors={authors}
          categories={categories}
          tags={tags}
          loading={loading}
          onSave={onSidebarSave}
          onCategoryAdded={fetchCategories}
          onTagAdded={fetchTags}
        />
      </div>
    </div>
  );
}
