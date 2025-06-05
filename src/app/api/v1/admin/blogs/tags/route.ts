import { NextRequest } from "next/server";
import { tagService } from "@/services/admin/blogs/tag.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const tags = await tagService.getAll();
    return SuccessResponse(tags);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
