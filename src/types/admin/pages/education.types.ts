import { EducationType } from "@/enums/admin/pages/education.enum";

export interface IEducation {
  _id: string;
  educationName: string;
  instituteName: string;
  educationType: EducationType;
  description?: string;
  fromYear: string;
  toYear: string;
  tags: string[];
}

export type EducationRequest = Omit<IEducation, "_id">;
export type EducationResponse = IEducation;
