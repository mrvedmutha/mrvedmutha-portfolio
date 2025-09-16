import { z } from "zod";

export const serviceZodSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be less than 100 characters"),
  icon: z.object({
    name: z.string().min(1, "Icon name is required"),
    lucideName: z.string().min(1, "Icon lucide name is required"),
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  tags: z.array(
    z.object({
      name: z.string().min(1, "Tag name is required"),
      _id: z.string().optional(),
    })
  ).min(1, "At least one tag is required"),
});