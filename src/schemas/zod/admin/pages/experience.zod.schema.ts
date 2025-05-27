import { z } from "zod";

export const experienceZodSchema = z
  .object({
    jobTitle: z.string().min(2, "Job Title is required"),
    companyName: z.string().min(2, "Company Name is required"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().optional(),
    currentlyWorking: z.boolean(),
    tags: z.array(z.string()),
    aboutCompany: z.string().optional(),
    responsibilities: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.toDate || !data.fromDate) return true;
      return new Date(data.fromDate) <= new Date(data.toDate);
    },
    {
      message: "From date must be before or equal to To date.",
      path: ["toDate"],
    }
  );

export type ExperienceZodType = z.infer<typeof experienceZodSchema>;
