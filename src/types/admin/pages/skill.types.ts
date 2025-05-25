// Types for admin skill page

export interface ISkillTag {
  name: string;
  svg: string;
}

export interface ISkillIcon {
  name: string;
  lucideName: string; // e.g. 'Code', 'Database', etc.
}

export interface ISkill {
  _id?: string;
  title: string;
  icon: ISkillIcon;
  tags: ISkillTag[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type SkillFormValues = {
  title: string;
  icon: ISkillIcon;
  tags: ISkillTag[];
};

export type SkillRequest = SkillFormValues;

export type SkillResponse = ISkill;
