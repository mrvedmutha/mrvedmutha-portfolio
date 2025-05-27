import { Skill } from "@/models/admin/pages/skill.model";
import { skillZodSchema } from "@/schemas/zod/admin/pages/skill.zod.schema";
import type {
  SkillRequest,
  SkillResponse,
} from "@/types/admin/pages/skill.types";
import { dbConnect } from "@/lib/db";

export const skillService = {
  async create(data: SkillRequest): Promise<SkillResponse> {
    await dbConnect();
    // Validate input
    const parsed = skillZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    // Save to DB
    const skill = new Skill(parsed.data);
    await skill.save();
    return skill.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<SkillResponse[]> {
    await dbConnect();
    // Find all skills, limit and skip
    const skills = await Skill.find({}).skip(skip).limit(limit).lean();
    // Cast is safe because schema matches
    return skills as unknown as SkillResponse[];
  },

  async deleteSkill(id: string): Promise<void> {
    await dbConnect();
    await Skill.findByIdAndDelete(id);
  },
};
