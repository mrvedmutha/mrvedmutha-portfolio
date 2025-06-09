import { z } from "zod";

export const sectionsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currentCity: z.string().min(1, "Current city is required"),
  country: z.string().min(1, "Country is required"),
  degree: z.string().min(1, "Degree is required"),
  dob: z.string().min(1, "Date of birth is required"), // can be refined to date if needed
  about: z.string().min(1, "About me is required"),
});

export type SectionsFormValues = z.infer<typeof sectionsSchema>;
