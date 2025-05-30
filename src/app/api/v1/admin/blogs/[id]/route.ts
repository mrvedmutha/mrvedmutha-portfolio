import { NextRequest } from "next/server";
import { blogService } from "@/services/admin/blogs/blog.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const blog = await blogService.getById(id);
    if (!blog) {
      return FailureResponse("Blog not found", 404);
    }
    return SuccessResponse(blog);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { id } = await params;
    const data = await req.json();
    const updated = await blogService.updateById(id, data);
    if (!updated) {
      return FailureResponse("Blog not found", 404);
    }
    return SuccessResponse(updated);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { id } = await params;
    await blogService.deleteById(id);
    return SuccessResponse(true);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
