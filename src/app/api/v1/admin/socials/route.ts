import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { socialService } from "@/services/admin/pages/social.services";
import { Social } from "@/models/admin/pages/social.model";
import { dbConnect } from "@/lib/db";
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [socials, total] = await Promise.all([
      socialService.getAll(limit, skip),
      Social.countDocuments({}),
    ]);
    return SuccessResponse({ data: socials, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch socials", 500);
  }
}
