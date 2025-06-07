import { z } from "zod";

export const contactZodSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message is required"),
  recaptchaToken: z.string().min(1, "reCAPTCHA is required"),
});

export type ContactMessageZodType = z.infer<typeof contactZodSchema>;
