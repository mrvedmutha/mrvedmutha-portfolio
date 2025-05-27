import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IToolTag } from "@/types/admin/pages/tooltag.types";

interface ToolSelectProps {
  tools: IToolTag[];
  value: IToolTag[];
  onChange: (tools: IToolTag[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const ToolSelect: React.FC<ToolSelectProps> = ({
  tools,
  value,
  onChange,
  open,
  onOpenChange,
  className = "",
}) => {
  const [toolInput, setToolInput] = React.useState("");
  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(toolInput.toLowerCase()) &&
      !value.some((tag) => tag.name === t.name)
  );

  const handleAdd = (tool: IToolTag) => {
    onChange([...value, tool]);
    setToolInput("");
    onOpenChange(false);
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((t) => t.name !== name));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tool) => (
          <span
            key={tool.name}
            className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
          >
            <Image src={tool.svg} alt={tool.name} width={20} height={20} />
            {tool.name}
            <button
              type="button"
              className="ml-1 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemove(tool.name)}
              aria-label={`Remove ${tool.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 w-full justify-start"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
        >
          <span>Add Tool</span>
        </Button>
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-popover border rounded shadow-lg">
            <Command>
              <CommandInput
                placeholder="Search tool..."
                value={toolInput}
                onValueChange={setToolInput}
                autoFocus
              />
              <CommandList>
                {filteredTools.length === 0 ? (
                  <CommandEmpty>No tools found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredTools.map((tool) => (
                      <CommandItem
                        key={tool.name}
                        onSelect={() => handleAdd(tool)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Image
                          src={tool.svg}
                          alt={tool.name}
                          width={20}
                          height={20}
                        />
                        <span>{tool.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolSelect;
