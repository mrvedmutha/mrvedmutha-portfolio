import { z } from "zod";

export const contactZodSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  interestedIn: z.string().min(1, "Please select a service"),
  budgetRange: z.string().min(1, "Budget range is required"),
  currency: z.enum(["USD", "INR"], {
    required_error: "Please select a currency",
  }),
  country: z.string().min(1, "Please select a country"),
  message: z.string().min(5, "Message is required"),
  recaptchaToken: z.string().min(1, "reCAPTCHA is required"),
});

export type ContactMessageZodType = z.infer<typeof contactZodSchema>;
