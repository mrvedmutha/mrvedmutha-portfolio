"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ServiceFormValues } from "@/types/admin/pages/service.types";
import { serviceZodSchema } from "@/schemas/zod/admin/pages/service.zod.schema";
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
import * as LucideIcons from "lucide-react";

// Available service icons
const serviceIcons = [
  { name: "Panels Top Left", lucideName: "PanelsTopLeft" },
  { name: "Pen Tool", lucideName: "PenTool" },
  { name: "Folder Open Dot", lucideName: "FolderOpenDot" },
  { name: "Square Arrow Out Up Right", lucideName: "SquareArrowOutUpRight" },
  { name: "Code", lucideName: "Code" },
  { name: "Palette", lucideName: "Palette" },
  { name: "Monitor", lucideName: "Monitor" },
  { name: "Smartphone", lucideName: "Smartphone" },
];

export function NewServiceForm() {
  const [iconOpen, setIconOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceZodSchema),
    defaultValues: {
      name: "",
      icon: serviceIcons[0],
      description: "",
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

  const addTag = () => {
    if (tagInput.trim() && !tags.some(tag => tag.name === tagInput.trim())) {
      setValue("tags", [...tags, { name: tagInput.trim() }]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue("tags", tags.filter((_, i) => i !== index));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const response = await axios.post("/api/v1/admin/services/create", data);
      toast({
        title: "Service created",
        description: "Service created successfully!",
      });
      setTimeout(() => {
        router.push("/admin/pages/services");
      }, 500);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create service.",
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
        {/* Service Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Web Development" {...field} />
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
                      const IconComp = (LucideIcons as any)[field.value.lucideName];
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
                          <CommandGroup heading="Service Icons">
                            {serviceIcons.map((item) => {
                              const IconComp = (LucideIcons as any)[item.lucideName];
                              return (
                                <CommandItem
                                  key={item.lucideName}
                                  onSelect={() => {
                                    field.onChange(item);
                                    setIconOpen(false);
                                  }}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  {IconComp && <IconComp className="w-5 h-5" />}
                                  <span>{item.name}</span>
                                  {field.value?.lucideName === item.lucideName && (
                                    <Check className="ml-auto w-4 h-4 text-primary" />
                                  )}
                                </CommandItem>
                              );
                            })}
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

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the service in detail..."
                  className="resize-none"
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Input */}
        <FormField
          control={control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag..."
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={`${tag.name}-${index}`}
                        className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
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
          {form.formState.isSubmitting ? "Saving..." : "Save Service"}
        </Button>
      </form>
    </Form>
  );
}

export default NewServiceForm;