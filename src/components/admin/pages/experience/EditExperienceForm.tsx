"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceZodSchema,
  ExperienceZodType,
} from "@/schemas/zod/admin/pages/experience.zod.schema";
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
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function EditExperienceForm({
  experience,
}: {
  experience: ExperienceZodType & { _id: string };
}) {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<ExperienceZodType>({
    resolver: zodResolver(experienceZodSchema),
    defaultValues: experience,
  });
  const [fromMonth, setFromMonth] = useState<string>(
    experience.fromDate ? String(new Date(experience.fromDate).getMonth()) : ""
  );
  const [fromYear, setFromYear] = useState<string>(
    experience.fromDate
      ? String(new Date(experience.fromDate).getFullYear())
      : ""
  );
  const [toMonth, setToMonth] = useState<string>(
    experience.toDate ? String(new Date(experience.toDate).getMonth()) : ""
  );
  const [toYear, setToYear] = useState<string>(
    experience.toDate ? String(new Date(experience.toDate).getFullYear()) : ""
  );
  const router = useRouter();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

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

  const handleFromMonthYearChange = (month: string, year: string) => {
    setFromMonth(month);
    setFromYear(year);
    if (month && year) {
      const date = new Date(Number(year), Number(month), 1);
      form.setValue("fromDate", date.toISOString());
    } else {
      form.setValue("fromDate", "");
    }
  };
  const handleToMonthYearChange = (month: string, year: string) => {
    setToMonth(month);
    setToYear(year);
    if (month && year) {
      const date = new Date(Number(year), Number(month), 1);
      form.setValue("toDate", date.toISOString());
    } else {
      form.setValue("toDate", "");
    }
  };

  async function onSubmit(values: ExperienceZodType) {
    setLoading(true);
    try {
      await axios.patch(`/api/v1/admin/experience/${experience._id}`, values);
      toast({
        title: "Experience updated!",
        description: "Your experience has been updated.",
      });
      router.push("/admin/pages/experience");
    } catch (error: any) {
      toast({
        title: "Failed to update experience",
        description:
          error?.response?.data?.message || error.message || "Unknown error",
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
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tech Solutions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aboutCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Company</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the company..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fromDate"
          render={() => (
            <FormItem>
              <FormLabel>From Date</FormLabel>
              <div className="flex gap-2">
                <Select
                  value={fromMonth}
                  onValueChange={(val) =>
                    handleFromMonthYearChange(val, fromYear)
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, idx) => (
                      <SelectItem key={m} value={String(idx)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={fromYear}
                  onValueChange={(val) =>
                    handleFromMonthYearChange(fromMonth, val)
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.watch("fromDate") ? (
                  <span className="ml-2 text-muted-foreground">
                    {format(new Date(form.watch("fromDate") ?? ""), "MMM-yy")}
                  </span>
                ) : null}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={() => (
            <FormItem>
              <FormLabel>To Date</FormLabel>
              <div className="flex gap-2">
                <Select
                  value={toMonth}
                  onValueChange={(val) => handleToMonthYearChange(val, toYear)}
                  disabled={form.watch("currentlyWorking")}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, idx) => (
                      <SelectItem key={m} value={String(idx)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={toYear}
                  onValueChange={(val) => handleToMonthYearChange(toMonth, val)}
                  disabled={form.watch("currentlyWorking")}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.watch("toDate") ? (
                  <span className="ml-2 text-muted-foreground">
                    {format(new Date(form.watch("toDate") ?? ""), "MMM-yy")}
                  </span>
                ) : null}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentlyWorking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (e.target.checked) {
                      setToMonth("");
                      setToYear("");
                      form.setValue("toDate", "");
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="mb-0">
                I am currently working here
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your responsibilities..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          {loading ? "Saving..." : "Update Experience"}
        </Button>
      </form>
    </Form>
  );
}

export default EditExperienceForm;
