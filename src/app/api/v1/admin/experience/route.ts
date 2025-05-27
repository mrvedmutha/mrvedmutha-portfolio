import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { experienceService } from "@/services/admin/pages/experience.services";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const experiences = await experienceService.getAll();
    return SuccessResponse(experiences, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch experiences", 500);
  }
}
