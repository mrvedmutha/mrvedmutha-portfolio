import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { experienceService } from "@/services/admin/pages/experience.services";
import type { NextRequest } from "next/server";
import { Experience } from "@/models/admin/pages/experience.model";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [experiences, total] = await Promise.all([
      experienceService.getAll(limit, skip),
      Experience.countDocuments({}),
    ]);
    return SuccessResponse({ data: experiences, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch experiences", 500);
  }
}
