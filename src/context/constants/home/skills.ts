import axios from "axios";

export interface SkillTag {
  name: string;
  svg: string;
}

export interface Skill {
  title: string;
  icon: string; // lucideName
  tools: SkillTag[];
}

export const getSkills = async (): Promise<Skill[]> => {
  try {
    const res = await axios.get("/api/v1/admin/skills");
    const data = res.data?.data?.data || [];
    return data.map((skill: any) => ({
      title: skill.title,
      icon: skill.icon?.lucideName,
      tools: Array.isArray(skill.tags)
        ? skill.tags.map((tag: any) => ({ name: tag.name, svg: tag.svg }))
        : [],
    }));
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }
};
