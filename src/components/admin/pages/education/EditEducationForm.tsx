"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, School, GraduationCap, ScrollText, BookOpen } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { IEducation } from "@/types/admin/pages/education.types";

const educationTypes = [
  { value: "School", label: "School", icon: School },
  { value: "College", label: "College", icon: GraduationCap },
  { value: "Certification", label: "Certificate", icon: ScrollText },
  { value: "Diploma", label: "Diploma", icon: BookOpen },
];

export function EditEducationForm({ education }: { education: IEducation }) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [educationType, setEducationType] = useState<string>(
    education.educationType
  );
  const [fromYear, setFromYear] = useState<string>(education.fromYear);
  const [toYear, setToYear] = useState<string>(education.toYear);
  const form = useForm({
    defaultValues: education,
  });
  const router = useRouter();
  const { toast } = useToast();

  // Years for select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => String(currentYear - i));

  // Tag handlers
  const tags = form.watch("tags") || [];
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      form.setValue("tags", [...tags, tag]);
    }
  };
  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t: string) => t !== tag)
    );
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "," || e.key === "Enter") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      await axios.patch(`/api/v1/admin/education/${education._id}`, values);
      toast({
        title: "Education updated!",
        description: "Your education record has been updated.",
      });
      router.push("/admin/pages/education");
    } catch (error: any) {
      toast({
        title: "Failed to update education",
        description:
          error?.response?.data?.error || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="educationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. B.Tech Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instituteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institute Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. IIT Bombay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="educationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  setEducationType(val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {educationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the education..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="fromYear"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>From Year</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setFromYear(val);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toYear"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>To Year</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setToYear(val);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-destructive"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type and press comma or Enter..."
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Update Education"}
        </Button>
      </form>
    </Form>
  );
}

export default EditEducationForm;
