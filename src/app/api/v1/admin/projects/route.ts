import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { projectService } from "@/services/admin/pages/project.services";
import type { NextRequest } from "next/server";
import { Project } from "@/models/admin/pages/project.model";
import { dbConnect } from "@/lib/db";
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      projectService.getAll(limit, skip),
      Project.countDocuments({}),
    ]);
    return SuccessResponse({ data: projects, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch projects", 500);
  }
}
