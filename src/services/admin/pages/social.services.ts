import { Social } from "@/models/admin/pages/social.model";
import { socialZodSchema } from "@/schemas/zod/admin/pages/social.zod.schema";
import type { ISocial } from "@/types/admin/pages/social.types";
import { dbConnect } from "@/lib/db";

export const socialService = {
  async create(data: ISocial): Promise<ISocial> {
    await dbConnect();
    const parsed = socialZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const social = new Social(parsed.data);
    await social.save();
    return social.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<ISocial[]> {
    await dbConnect();
    const socials = await Social.find({}).skip(skip).limit(limit).lean();
    return socials as unknown as ISocial[];
  },

  async getById(id: string): Promise<ISocial | null> {
    await dbConnect();
    return Social.findById(id).lean() as Promise<ISocial | null>;
  },

  async updateById(id: string, data: ISocial): Promise<ISocial | null> {
    await dbConnect();
    const parsed = socialZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    return Social.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean() as Promise<ISocial | null>;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Social.findByIdAndDelete(id);
  },
};
