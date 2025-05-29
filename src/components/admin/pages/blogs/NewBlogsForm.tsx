"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/ui/TipTapEditor";
import { CodeIcon } from "lucide-react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import BlogPostSidebar from "./BlogPostSidebar";

export default function NewBlogsForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdit, setSlugEdit] = useState(false);
  const [description, setDescription] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [htmlEdit, setHtmlEdit] = useState("");

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!slugEdit) {
      setSlug(
        e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Toggle to HTML view, just set htmlEdit to description
  const handleShowHtml = () => {
    if (!showHtml) {
      setHtmlEdit(description);
    }
    setShowHtml((v) => !v);
  };

  // Save HTML back to TipTap
  const handleSaveHtml = () => {
    setDescription(htmlEdit);
    setShowHtml(false);
  };

  return (
    <div className="flex gap-8">
      {/* Main Content (80%) */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold mb-6">Create blog</h1>
        {/* Post Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="post-title">
            Post Title
          </label>
          <Input
            id="post-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Post Title"
            className="text-2xl font-bold mb-2"
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
              <Input
                id="post-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!slugEdit}
                className="flex-1 text-base"
                style={{ minWidth: 0 }}
              />
              {slugEdit ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSlugEdit(false)}
                >
                  Save
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSlugEdit(true)}
                >
                  Edit
                </Button>
              )}
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
              <TipTapEditor
                value={description}
                onChange={setDescription}
                editorHeight={400}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
