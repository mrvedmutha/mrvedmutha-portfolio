import { Schema } from "mongoose";
import type { ISkill } from "@/types/admin/pages/skill.types";

// Sub-schema for icon
const SkillIconSchema = new Schema(
  {
    name: { type: String, required: true },
    lucideName: { type: String, required: true },
  },
  { _id: false }
);

// Sub-schema for tag/tool
const SkillTagSchema = new Schema(
  {
    name: { type: String, required: true },
    svg: { type: String, required: true },
  },
  { _id: false }
);

// Main Skill schema
export const skillSchema = new Schema<ISkill>(
  {
    title: { type: String, required: true },
    icon: { type: SkillIconSchema, required: true },
    tags: { type: [SkillTagSchema], required: true },
  },
  {
    timestamps: true,
  }
);
