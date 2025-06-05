import { NextRequest } from "next/server";
import { blogService } from "@/services/admin/blogs/blog.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const blogs = await blogService.getAll(limit, skip);
    return SuccessResponse(blogs);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
