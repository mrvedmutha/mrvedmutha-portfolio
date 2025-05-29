"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Code as CodeIcon,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import SimpleCodeEditor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdit, setSlugEdit] = useState(false);
  const [description, setDescription] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlEdit, setHtmlEdit] = useState("");

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading,
      Image,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

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

  return (
    <div className="flex min-h-screen">
      {/* Left 75% */}
      <div className="w-3/4 p-8 border-r">
        <h1 className="text-2xl font-bold mb-6">Create blog</h1>
        {/* Post Title */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="post-title"
          >
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
        {/* Post Description (Tiptap) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Post Description
          </label>
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Button
              type="button"
              size="icon"
              variant={editor?.isActive("bold") ? "default" : "outline"}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              aria-label="Bold"
            >
              <BoldIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={editor?.isActive("italic") ? "default" : "outline"}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              aria-label="Italic"
            >
              <ItalicIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={editor?.isActive("underline") ? "default" : "outline"}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              aria-label="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive({ textAlign: "left" }) ? "default" : "outline"
              }
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              aria-label="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive({ textAlign: "center" })
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              aria-label="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive({ textAlign: "right" }) ? "default" : "outline"
              }
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              aria-label="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive({ textAlign: "justify" })
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                editor?.chain().focus().setTextAlign("justify").run()
              }
              aria-label="Align Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={editor?.isActive("bulletList") ? "default" : "outline"}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              aria-label="Bullet List"
            >
              <ListIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={editor?.isActive("orderedList") ? "default" : "outline"}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              aria-label="Numbered List"
            >
              <ListOrderedIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive("heading", { level: 1 })
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              aria-label="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive("heading", { level: 2 })
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              aria-label="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={
                editor?.isActive("heading", { level: 3 })
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              aria-label="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => {
                const url = window.prompt("Image URL");
                if (url) editor?.chain().focus().setImage({ src: url }).run();
              }}
              aria-label="Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={editor?.isActive("link") ? "default" : "outline"}
                  onClick={() => {
                    if (editor) {
                      // If already a link, remove it
                      if (editor.isActive("link")) {
                        editor.chain().focus().unsetLink().run();
                        setShowLinkPopover(false);
                        return;
                      }
                      setShowLinkPopover((open) => !open);
                      setTimeout(() => {
                        linkInputRef.current?.focus();
                      }, 100);
                    }
                  }}
                  aria-label="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-4 flex flex-col gap-2"
                align="start"
                sideOffset={8}
              >
                <label htmlFor="link-url" className="text-xs font-medium mb-1">
                  Add/Edit Link
                </label>
                <input
                  ref={linkInputRef}
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  className="border rounded px-2 py-1 text-sm"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (editor && linkUrl) {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: linkUrl })
                          .run();
                        setShowLinkPopover(false);
                        setLinkUrl("");
                      }
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (editor && linkUrl) {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: linkUrl })
                          .run();
                        setShowLinkPopover(false);
                        setLinkUrl("");
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowLinkPopover(false);
                      setLinkUrl("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              size="icon"
              variant={showHtml ? "default" : "outline"}
              onClick={() => setShowHtml((v) => !v)}
              aria-label="HTML"
            >
              <CodeIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="border rounded min-h-[200px] p-4 bg-background">
            {showHtml ? (
              <SimpleCodeEditor
                value={htmlEdit}
                onValueChange={(code) => {
                  setHtmlEdit(code);
                  setDescription(code);
                  editor?.commands.setContent(code, false);
                }}
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.markup, "markup")
                }
                padding={10}
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  minHeight: 300,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  color: "#1e293b",
                }}
                textareaId="html-code-editor"
                textareaClassName="w-full h-[300px] resize-none focus:outline-none"
                autoFocus
                spellCheck={false}
              />
            ) : (
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none custom-tiptap-content"
              />
            )}
          </div>
        </div>
      </div>
      {/* Right 25% */}
      <div className="w-1/4 p-8"></div>
    </div>
  );
}
