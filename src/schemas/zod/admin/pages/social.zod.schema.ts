import { z } from "zod";

export const socialZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  network: z.string().min(1, "Network is required"),
  url: z.string().url("A valid URL is required"),
});

export type SocialZodType = z.infer<typeof socialZodSchema>;
