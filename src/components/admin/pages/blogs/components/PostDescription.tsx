"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { CodeIcon } from "lucide-react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import TipTapEditor from "@/components/ui/TipTapEditor";

interface PostDescriptionProps {
  value: string;
  onChange: (val: string) => void;
  showHtml: boolean;
  setShowHtml: (v: boolean) => void;
  htmlEdit: string;
  setHtmlEdit: (v: string) => void;
  handleSaveHtml: () => void;
}

const PostDescription: React.FC<PostDescriptionProps> = ({
  value,
  onChange,
  showHtml,
  setShowHtml,
  htmlEdit,
  setHtmlEdit,
  handleSaveHtml,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-4">Post Description</label>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant={showHtml ? "default" : "outline"}
          onClick={() => {
            if (!showHtml) setHtmlEdit(value);
            setShowHtml(!showHtml);
          }}
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
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
            editorHeight={400}
          />
        )}
      </div>
    </div>
  );
};

export default PostDescription;
