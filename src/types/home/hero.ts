export type HeroSkill = string;

// If you want to make the skills configurable via props in the future:
export interface HeroProps {
  skills?: HeroSkill[];
}
