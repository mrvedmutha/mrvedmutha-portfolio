import { Skill } from "@/models/admin/pages/skill.model";

export async function getSkillById(id: string) {
  return Skill.findById(id).lean();
}

export async function updateSkillById(id: string, data: any) {
  return Skill.findByIdAndUpdate(id, data, { new: true }).lean();
}
