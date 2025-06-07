import { NextRequest } from "next/server";
import { blogService } from "@/services/admin/blogs/blog.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { dbConnect } from "@/lib/db";
import { startBlogScheduler } from "@/lib/blogScheduler";
import "@/models/admin/blogs/author.model";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await startBlogScheduler();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const blog = await blogService.getBySlug(slug);
      if (!blog) return FailureResponse("Blog not found", 404);
      return SuccessResponse(blog);
    }
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const blogs = await blogService.getAll(limit, skip);
    return SuccessResponse(blogs);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
