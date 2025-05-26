"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import Image from "next/image";
import { lucideIcons } from "@/context/constants/admin/pages/skills";
import { deviconTools } from "@/context/constants/admin/pages/skills";
import { Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SkillFormValues } from "@/types/admin/pages/skill.types";
import { skillZodSchema } from "@/schemas/zod/admin/pages/skill.zod.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function EditSkillForm({
  skill,
}: {
  skill: SkillFormValues & { _id: string };
}) {
  const [iconOpen, setIconOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [toolInput, setToolInput] = React.useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillZodSchema),
    defaultValues: skill,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;
  const icon = watch("icon");
  const tags = watch("tags");

  const filteredTools = deviconTools.filter(
    (t) =>
      t.name.toLowerCase().includes(toolInput.toLowerCase()) &&
      !tags.some((tag) => tag.name === t.name)
  );

  const addTool = (tool: (typeof deviconTools)[0]) => {
    setValue("tags", [...tags, tool]);
    setToolInput("");
  };

  const removeTool = (name: string) => {
    setValue(
      "tags",
      tags.filter((t) => t.name !== name)
    );
  };

  const onSubmit = async (data: SkillFormValues) => {
    try {
      await axios.patch(`/api/v1/admin/skills/${skill._id}`, data);
      toast({
        title: "Skill updated",
        description: "Skill updated successfully!",
      });
      setTimeout(() => {
        router.push("/admin/pages/skills");
      }, 500);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update skill.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 max-w-lg mx-auto p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Skill Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend UI Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Icon Picker */}
        <FormField
          control={control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-start"
                    onClick={() => setIconOpen((open) => !open)}
                    aria-expanded={iconOpen}
                  >
                    {(() => {
                      if (!field.value) return null;
                      const IconComp = lucideIcons.find(
                        (i) => i.name === field.value.name
                      )?.icon;
                      return IconComp ? <IconComp className="w-5 h-5" /> : null;
                    })()}
                    <span>{field.value?.name || "Select an icon"}</span>
                  </Button>
                  {iconOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-popover border rounded shadow-lg">
                      <Command>
                        <CommandInput placeholder="Search icon..." />
                        <CommandList>
                          <CommandEmpty>No icons found.</CommandEmpty>
                          <CommandGroup heading="Lucide Icons">
                            {lucideIcons.map((item) => (
                              <CommandItem
                                key={item.name}
                                onSelect={() => {
                                  field.onChange({
                                    name: item.name,
                                    lucideName: item.name,
                                  });
                                  setIconOpen(false);
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                {item.icon && <item.icon className="w-5 h-5" />}
                                <span>{item.name}</span>
                                {field.value?.name === item.name && (
                                  <Check className="ml-auto w-4 h-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Tools/Tags Input */}
        <FormField
          control={control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tools / Tags</FormLabel>
              <FormControl>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tool) => (
                      <span
                        key={tool.name}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        <Image
                          src={tool.svg}
                          alt={tool.name}
                          width={20}
                          height={20}
                        />
                        {tool.name}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-destructive"
                          onClick={() => removeTool(tool.name)}
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
                      onClick={() => setToolsOpen((open) => !open)}
                      aria-expanded={toolsOpen}
                    >
                      <span>Add Tool</span>
                    </Button>
                    {toolsOpen && (
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
                                    onSelect={() => {
                                      addTool(tool);
                                      setToolsOpen(false);
                                    }}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Update Skill"}
        </Button>
      </form>
    </Form>
  );
}

export default EditSkillForm;
