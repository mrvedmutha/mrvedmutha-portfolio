import { z } from "zod";

export const projectZodSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  type: z.enum(["code", "graphic"]),
  githubLink: z.string().url().optional().or(z.literal("")),
  behanceLink: z.string().url().optional().or(z.literal("")),
  demoLink: z.string().url().optional().or(z.literal("")),
  image: z.string().optional(),
  techstack: z
    .array(z.object({ name: z.string(), svg: z.string() }))
    .min(1, "Select at least one tool"),
});

export type ProjectZodType = z.infer<typeof projectZodSchema>;
