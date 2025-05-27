import { Experience } from "@/models/admin/pages/experience.model";
import { experienceZodSchema } from "@/schemas/zod/admin/pages/experience.zod.schema";
import type {
  ExperienceRequest,
  ExperienceResponse,
} from "@/types/admin/pages/experience.types";
import { dbConnect } from "@/lib/db";

export const experienceService = {
  async create(data: ExperienceRequest): Promise<ExperienceResponse> {
    await dbConnect();
    // Validate input
    const parsed = experienceZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    // Save to DB
    const experience = new Experience(parsed.data);
    await experience.save();
    return experience.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<ExperienceResponse[]> {
    await dbConnect();
    const experiences = await Experience.find({})
      .skip(skip)
      .limit(limit)
      .lean();
    return experiences as unknown as ExperienceResponse[];
  },

  async getById(id: string): Promise<ExperienceResponse | null> {
    await dbConnect();
    const experience = await Experience.findById(id).lean();
    return experience ? (experience as unknown as ExperienceResponse) : null;
  },

  async updateById(
    id: string,
    data: ExperienceRequest
  ): Promise<ExperienceResponse | null> {
    await dbConnect();
    const parsed = experienceZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const updated = await Experience.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as ExperienceResponse) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Experience.findByIdAndDelete(id);
  },
};
