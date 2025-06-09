import Sections from "@/models/admin/pages/sections.model";
import { sectionsSchema } from "@/schemas/zod/admin/pages/sections.zod.schema";
import type {
  SectionsRequest,
  SectionsResponse,
} from "@/types/admin/pages/sections.types";
import { dbConnect } from "@/lib/db";

export const sectionsService = {
  async create(data: SectionsRequest): Promise<SectionsResponse> {
    await dbConnect();
    const parsed = sectionsSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error?.errors?.map((e: any) => e.message).join(", ") ??
          "Validation error"
      );
    }
    const section = new Sections(parsed.data);
    await section.save();
    return section.toObject() as SectionsResponse;
  },

  async getAll(limit = 25, skip = 0): Promise<SectionsResponse[]> {
    await dbConnect();
    const sections = await Sections.find({}).skip(skip).limit(limit).lean();
    return sections as unknown as SectionsResponse[];
  },

  async getById(id: string): Promise<SectionsResponse | null> {
    await dbConnect();
    const section = await Sections.findById(id).lean();
    return section ? (section as unknown as SectionsResponse) : null;
  },

  async updateById(
    id: string,
    data: Partial<SectionsRequest>
  ): Promise<SectionsResponse | null> {
    await dbConnect();
    // Partial validation
    const baseSchema = (sectionsSchema as any)._def.schema;
    const parsed = baseSchema.partial().safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error?.errors?.map((e: any) => e.message).join(", ") ??
          "Validation error"
      );
    }
    const updated = await Sections.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as SectionsResponse) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Sections.findByIdAndDelete(id);
  },
};
