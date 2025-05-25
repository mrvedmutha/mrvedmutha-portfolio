import { Skill } from "@/models/admin/pages/skill.model";
import { skillZodSchema } from "@/schemas/zod/admin/pages/skill.zod.schema";
import type {
  SkillRequest,
  SkillResponse,
} from "@/types/admin/pages/skill.types";
import { dbConnect } from "@/lib/db";

export async function createSkill(data: SkillRequest): Promise<SkillResponse> {
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
}
