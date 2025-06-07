import axios from "axios";

export interface ProjectTag {
  name: string;
  svg: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  githubLink?: string;
  behanceLink?: string;
  demoLink?: string;
  techstack: ProjectTag[];
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await axios.get("/api/v1/admin/projects");
    const data = res.data?.data?.data || [];
    return data.map((project: any) => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      type: project.type,
      githubLink: project.githubLink,
      behanceLink: project.behanceLink,
      demoLink: project.demoLink,
      techstack: Array.isArray(project.techstack)
        ? project.techstack.map((tag: any) => ({
            name: tag.name,
            svg: tag.svg,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};
