import { IToolTag } from "./tooltag.types";
import { EProjectType } from "@/enums/admin/pages/EProjectType";

export type ProjectType = EProjectType;

export interface IProject {
  _id: string;
  title: string;
  description: string;
  type: EProjectType;
  githubLink?: string;
  behanceLink?: string;
  demoLink?: string;
  techstack: IToolTag[];
}

export type ProjectRequest = Omit<IProject, "_id">;
export type ProjectResponse = IProject;
