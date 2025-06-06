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

  async getAllTagIcons(): Promise<{ name: string; svg: string }[]> {
    await dbConnect();
    const skills = await Skill.find({}).lean();
    // Flatten all tag objects from all skills
    const allTags = skills.flatMap((skill: any) => skill.tags || []);
    // Optionally deduplicate by name if needed:
    // const uniqueTags = Array.from(new Map(allTags.map(tag => [tag.name, tag])).values());
    return allTags;
  },

  async getAllSkillTitles(): Promise<string[]> {
    await dbConnect();
    const skills = await Skill.find({}, { title: 1, _id: 0 }).lean();
    return skills.map((skill: any) => skill.title);
  },
};
