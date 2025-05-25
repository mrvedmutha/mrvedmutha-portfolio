import { z } from "zod";

export const skillZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.object({
    name: z.string().min(1, "Icon name is required"),
    lucideName: z.string().min(1, "Lucide icon is required"),
  }),
  tags: z
    .array(
      z.object({
        name: z.string().min(1, "Tag name is required"),
        svg: z.string().min(1, "SVG path is required"),
      })
    )
    .min(1, "At least one tool/tag is required"),
});

export type SkillZodType = z.infer<typeof skillZodSchema>;
