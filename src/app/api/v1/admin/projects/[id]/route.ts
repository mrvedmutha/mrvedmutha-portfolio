import { NextRequest } from "next/server";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { projectZodSchema } from "@/schemas/zod/admin/pages/project.zod.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { projectService } from "@/services/admin/pages/project.services";
import type { ProjectRequest } from "@/types/admin/pages/project.types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await projectService.getById(id);
    if (!project) return FailureResponse("Project not found", 404);
    return SuccessResponse(project);
  } catch (err) {
    return FailureResponse("Failed to fetch project", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const updated = await projectService.updateById(
      id,
      parse.data as ProjectRequest
    );
    if (!updated) return FailureResponse("Project not found", 404);
    return SuccessResponse(updated);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to update project", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { id } = await params;
    await projectService.deleteById(id);
    return SuccessResponse({ message: "Project deleted" }, 200);
  } catch (err) {
    return FailureResponse("Failed to delete project", 500);
  }
}
