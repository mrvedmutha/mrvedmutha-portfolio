import Education from "@/models/admin/pages/education.model";
import { educationZodSchema } from "@/schemas/zod/admin/pages/education.zod.schema";
import type {
  EducationRequest,
  EducationResponse,
} from "@/types/admin/pages/education.types";
import { dbConnect } from "@/lib/db";

export const educationService = {
  async create(data: EducationRequest): Promise<EducationResponse> {
    await dbConnect();
    const parsed = educationZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error?.errors?.map((e: any) => e.message).join(", ") ??
          "Validation error"
      );
    }
    const education = new Education(parsed.data);
    await education.save();
    return education.toObject() as EducationResponse;
  },

  async getAll(limit = 25): Promise<EducationResponse[]> {
    await dbConnect();
    const educations = await Education.find({}).limit(limit).lean();
    return educations as unknown as EducationResponse[];
  },

  async getById(id: string): Promise<EducationResponse | null> {
    await dbConnect();
    const education = await Education.findById(id).lean();
    return education ? (education as unknown as EducationResponse) : null;
  },

  async updateById(
    id: string,
    data: Partial<EducationRequest>
  ): Promise<EducationResponse | null> {
    await dbConnect();
    // Partial validation
    const baseSchema = (educationZodSchema as any)._def.schema;
    const parsed = baseSchema.partial().safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error?.errors?.map((e: any) => e.message).join(", ") ??
          "Validation error"
      );
    }
    const updated = await Education.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as EducationResponse) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Education.findByIdAndDelete(id);
  },
};
