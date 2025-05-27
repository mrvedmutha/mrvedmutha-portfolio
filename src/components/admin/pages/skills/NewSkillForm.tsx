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
import { deviconTools } from "@/context/constants/common/tools";
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
import ToolSelect from "@/components/common/admin/pages/ToolSelect";

// Demo Lucide icons list

// Demo devicon tools list (name, svgPath relative to public)

export function NewSkillForm() {
  // State for icon picker
  const [iconOpen, setIconOpen] = React.useState(false);
  // Remove toolsOpen/toolInput state, move to ToolSelect
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillZodSchema),
    defaultValues: {
      title: "",
      icon: lucideIcons[0],
      tags: [],
    },
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

  const onSubmit = async (data: SkillFormValues) => {
    try {
      const response = await axios.post("/api/v1/admin/skills/create", data);
      toast({
        title: "Skill created",
        description: "Skill created successfully!",
      });
      setTimeout(() => {
        router.push("/admin/pages/skills");
      }, 500); // Give the toast a moment to show
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create skill.",
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
                <ToolSelect
                  tools={deviconTools}
                  value={tags}
                  onChange={(newTags) => setValue("tags", newTags)}
                  open={toolsOpen}
                  onOpenChange={setToolsOpen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
          onClick={() => {
            // TODO: Log button click
            console.log("TODO: Button clicked");
          }}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Skill"}
        </Button>
      </form>
    </Form>
  );
}

export default NewSkillForm;
