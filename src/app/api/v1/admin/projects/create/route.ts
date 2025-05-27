import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { projectZodSchema } from "@/schemas/zod/admin/pages/project.zod.schema";
import { projectService } from "@/services/admin/pages/project.services";
import type { ProjectRequest } from "@/types/admin/pages/project.types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const body = await req.json();
    const parse = projectZodSchema.safeParse(body);
    if (!parse.success) {
      return FailureResponse("Invalid data", 400);
    }
    const project = await projectService.create(parse.data as ProjectRequest);
    return SuccessResponse(project, 201);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to create project", 500);
  }
}
