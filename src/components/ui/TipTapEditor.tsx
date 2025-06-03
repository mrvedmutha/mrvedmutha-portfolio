import { useRef, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import HardBreak from "@tiptap/extension-hard-break";
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
  CornerDownLeft,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Iframe } from "./tiptap-iframe-extension";
import { Input } from "./input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showHtml?: boolean;
  onToggleHtml?: () => void;
  editorHeight?: number;
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder,
  showHtml,
  onToggleHtml,
  editorHeight = 200,
}: TipTapEditorProps) {
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showEmbedPopover, setShowEmbedPopover] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const embedInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Insert image into editor (upload to Cloudinary first)
  const handleInsertImage = async () => {
    if (imageFile && editor) {
      setImageUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await axios.post("/api/v1/admin/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res.data?.data?.url;
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
        setShowImagePopover(false);
        setImageFile(null);
        setImagePreview(null);
      } catch (err: any) {
        toast({
          title: "Image upload failed",
          description:
            err?.response?.data?.error ||
            err?.message ||
            "An error occurred while uploading the image.",
          variant: "destructive",
        });
      } finally {
        setImageUploading(false);
      }
    }
  };

  // Insert embed code into editor
  const handleInsertEmbed = () => {
    if (embedCode && editor) {
      editor.commands.focus();
      editor.commands.insertContent(embedCode);
      setShowEmbedPopover(false);
      setEmbedCode("");
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      HardBreak,
      ImageResize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Iframe,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        placeholder: placeholder || "Write something...",
        class: "focus:outline-none min-h-[200px]",
      },
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!mounted) return null;

  return (
    <div>
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
          variant="outline"
          onClick={() => editor?.chain().focus().setHardBreak().run()}
          aria-label="Line Break"
          title="Line Break (Shift+Enter)"
        >
          <CornerDownLeft className="w-4 h-4" />
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
            editor?.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
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
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          aria-label="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={
            editor?.isActive({ textAlign: "justify" }) ? "default" : "outline"
          }
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
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
            editor?.isActive("heading", { level: 1 }) ? "default" : "outline"
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
            editor?.isActive("heading", { level: 2 }) ? "default" : "outline"
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
            editor?.isActive("heading", { level: 3 }) ? "default" : "outline"
          }
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Popover open={showImagePopover} onOpenChange={setShowImagePopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setShowImagePopover((open) => !open)}
              aria-label="Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-4 flex flex-col gap-2"
            align="start"
            sideOffset={8}
          >
            <label className="text-xs font-medium mb-1">Upload Image</label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose file
              </Button>
              {imageFile && (
                <span className="text-xs truncate max-w-[120px]">
                  {imageFile.name}
                </span>
              )}
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-40 object-contain rounded border my-2"
              />
            )}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleInsertImage}
                disabled={!imagePreview || imageUploading || !editor}
              >
                {imageUploading ? "Uploading..." : "Insert"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowImagePopover(false);
                  setImageFile(null);
                  setImagePreview(null);
                }}
                disabled={imageUploading}
              >
                Cancel
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={showEmbedPopover} onOpenChange={setShowEmbedPopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setShowEmbedPopover((open) => !open)}
              aria-label="Embed"
            >
              <CodeIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-4 flex flex-col gap-2"
            align="start"
            sideOffset={8}
          >
            <label className="text-xs font-medium mb-1">
              Embed Code (iframe, etc.)
            </label>
            <input
              ref={embedInputRef}
              type="text"
              placeholder="<iframe ...></iframe>"
              className="border rounded px-2 py-1 text-sm"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsertEmbed();
                }
              }}
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleInsertEmbed}
                disabled={!embedCode}
              >
                Insert
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowEmbedPopover(false);
                  setEmbedCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
                    const { from, to, empty } = editor.state.selection;
                    if (empty) {
                      // No text selected: insert the URL as link text
                      editor
                        .chain()
                        .focus()
                        .insertContent(`<a href=\"${linkUrl}\">${linkUrl}</a>`)
                        .run();
                    } else {
                      // Text selected: wrap selection in link
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: linkUrl })
                        .run();
                    }
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
                    const { from, to, empty } = editor.state.selection;
                    if (empty) {
                      // No text selected: insert the URL as link text
                      editor
                        .chain()
                        .focus()
                        .insertContent(`<a href=\"${linkUrl}\">${linkUrl}</a>`)
                        .run();
                    } else {
                      // Text selected: wrap selection in link
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: linkUrl })
                        .run();
                    }
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
      </div>
      {showHtml ? (
        <pre className="rounded bg-[#18181b] p-4 overflow-x-auto min-h-[200px] text-xs">
          <code
            className="language-html"
            dangerouslySetInnerHTML={{
              __html: value,
            }}
          />
        </pre>
      ) : (
        <div
          className="border rounded p-4 bg-background"
          style={{ minHeight: editorHeight }}
        >
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none custom-tiptap-content"
          />
        </div>
      )}
    </div>
  );
}
