import { Project } from "@/models/admin/pages/project.model";
import { projectZodSchema } from "@/schemas/zod/admin/pages/project.zod.schema";
import type {
  ProjectRequest,
  ProjectResponse,
} from "@/types/admin/pages/project.types";
import { dbConnect } from "@/lib/db";

export const projectService = {
  async create(data: ProjectRequest): Promise<ProjectResponse> {
    await dbConnect();
    const parsed = projectZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const project = new Project(parsed.data);
    await project.save();
    return project.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<ProjectResponse[]> {
    await dbConnect();
    const projects = await Project.find({}).skip(skip).limit(limit).lean();
    return projects as unknown as ProjectResponse[];
  },

  async getById(id: string): Promise<ProjectResponse | null> {
    await dbConnect();
    const project = await Project.findById(id).lean();
    return project ? (project as unknown as ProjectResponse) : null;
  },

  async updateById(
    id: string,
    data: ProjectRequest
  ): Promise<ProjectResponse | null> {
    await dbConnect();
    const parsed = projectZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const updated = await Project.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as ProjectResponse) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Project.findByIdAndDelete(id);
  },
};
