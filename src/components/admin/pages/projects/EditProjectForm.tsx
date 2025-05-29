"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EProjectType } from "@/enums/admin/pages/EProjectType";
import ToolSelect from "@/components/common/admin/pages/ToolSelect";
import { Brush, CodeXml } from "lucide-react";
import { z } from "zod";
import { deviconTools } from "@/context/constants/common/tools";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const projectTypeOptions = [
  { value: EProjectType.CODE, label: "Code", icon: CodeXml },
  { value: EProjectType.GRAPHIC, label: "Graphic Design", icon: Brush },
];

const editProjectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  type: z.nativeEnum(EProjectType),
  githubLink: z.string().url().optional().or(z.literal("")),
  behanceLink: z.string().url().optional().or(z.literal("")),
  demoLink: z.string().url().optional().or(z.literal("")),
  techstack: z
    .array(z.object({ name: z.string(), svg: z.string() }))
    .min(1, "Select at least one tool"),
});

type EditProjectFormValues = z.infer<typeof editProjectSchema>;

type EditProjectFormProps = {
  project: EditProjectFormValues & { _id: string };
};

export function EditProjectForm({ project }: EditProjectFormProps) {
  const [type, setType] = React.useState<EProjectType>(project.type);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: project,
  });

  const { control, handleSubmit, setValue, watch, formState } = form;
  const techstack = watch("techstack");

  const onSubmit = async (data: EditProjectFormValues) => {
    setLoading(true);
    try {
      await axios.patch(`/api/v1/admin/projects/${project._id}`, data);
      toast({
        title: "Project updated!",
        description: "Your project has been updated.",
      });
      router.push("/admin/pages/projects");
    } catch (error: any) {
      toast({
        title: "Failed to update project",
        description:
          error?.response?.data?.message || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 max-w-lg mx-auto p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Project Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Portfolio Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Project Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your project..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Project Type */}
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val as EProjectType);
                    setType(val as EProjectType);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Github/Behance Link (conditional) */}
        {type === EProjectType.CODE && (
          <FormField
            control={control}
            name="githubLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/your-repo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === EProjectType.GRAPHIC && (
          <FormField
            control={control}
            name="behanceLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Behance Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://behance.net/your-project"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* Demo Link */}
        <FormField
          control={control}
          name="demoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo Link</FormLabel>
              <FormControl>
                <Input placeholder="https://your-demo-link.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Techstack (Tools) */}
        <FormField
          control={control}
          name="techstack"
          render={() => (
            <FormItem>
              <FormLabel>Techstack / Tools</FormLabel>
              <FormControl>
                <ToolSelect
                  tools={deviconTools}
                  value={techstack}
                  onChange={(newTags) => setValue("techstack", newTags)}
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
          disabled={formState.isSubmitting || loading}
        >
          {formState.isSubmitting || loading ? "Saving..." : "Update Project"}
        </Button>
      </form>
    </Form>
  );
}

export default EditProjectForm;
