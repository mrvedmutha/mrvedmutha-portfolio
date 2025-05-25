import { model, models } from "mongoose";
import type { ISkill } from "@/types/admin/pages/skill.types";
import { skillSchema } from "@/schemas/admin/pages/skill.schema";

export const Skill = models.Skill || model<ISkill>("Skill", skillSchema);
