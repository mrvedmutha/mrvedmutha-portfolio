import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { educationService } from "@/services/admin/pages/education.services";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const educations = await educationService.getAll(limit);
    return SuccessResponse(educations, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch educations", 500);
  }
}
