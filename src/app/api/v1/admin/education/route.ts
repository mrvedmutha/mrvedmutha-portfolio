import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { educationService } from "@/services/admin/pages/education.services";
import Education from "@/models/admin/pages/education.model";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [educations, total] = await Promise.all([
      educationService.getAll(limit, skip),
      Education.countDocuments({}),
    ]);
    return SuccessResponse({ data: educations, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch educations", 500);
  }
}
