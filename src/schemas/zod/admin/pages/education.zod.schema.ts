import { z } from "zod";
import { EducationType } from "@/enums/admin/pages/education.enum";

export const educationZodSchema = z
  .object({
    educationName: z.string().min(2, "Education Name is required"),
    instituteName: z.string().min(2, "Institute Name is required"),
    educationType: z.nativeEnum(EducationType),
    description: z.string().optional(),
    fromYear: z.string().min(4, "From Year is required"),
    toYear: z.string().min(4, "To Year is required"),
    tags: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (!data.fromYear || !data.toYear) return true;
      return Number(data.fromYear) <= Number(data.toYear);
    },
    {
      message: "From year must be before or equal to To year.",
      path: ["toYear"],
    }
  );

export type EducationZodType = z.infer<typeof educationZodSchema>;
