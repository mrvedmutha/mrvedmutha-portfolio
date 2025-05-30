import { NextRequest } from "next/server";
import { tagService } from "@/services/admin/blogs/tag.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export async function GET(req: NextRequest) {
  try {
    const tags = await tagService.getAll();
    return SuccessResponse(tags);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
