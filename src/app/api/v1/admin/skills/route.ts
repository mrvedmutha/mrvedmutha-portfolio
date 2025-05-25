import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { skillService } from "@/services/admin/pages/skills";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skills = await skillService.getAll(limit);
    return SuccessResponse(skills, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch skills", 500);
  }
}
