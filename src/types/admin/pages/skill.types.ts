// Types for admin skill page

import { IToolTag } from "@/types/admin/pages/tooltag.types";

export interface ISkillIcon {
  name: string;
  lucideName: string; // e.g. 'Code', 'Database', etc.
}

export interface ISkill {
  _id: string;
  title: string;
  icon: { name: string; lucideName: string };
  tags: { name: string; svg: string }[];
}

export type SkillFormValues = {
  title: string;
  icon: ISkillIcon;
  tags: IToolTag[];
};

export type SkillRequest = SkillFormValues;

export type SkillResponse = ISkill;
