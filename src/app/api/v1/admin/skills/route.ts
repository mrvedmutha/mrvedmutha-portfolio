import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { skillService } from "@/services/admin/pages/skill.services";
import { Skill } from "@/models/admin/pages/skill.model";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [skills, total] = await Promise.all([
      skillService.getAll(limit, skip),
      Skill.countDocuments({}),
    ]);
    return SuccessResponse({ data: skills, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch skills", 500);
  }
}
