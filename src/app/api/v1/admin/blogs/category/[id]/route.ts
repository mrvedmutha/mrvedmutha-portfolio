import { NextRequest } from "next/server";
import { categoryService } from "@/services/admin/blogs/category.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { dbConnect } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const category = await categoryService.getById(id);
    if (!category) {
      return FailureResponse("Category not found", 404);
    }
    return SuccessResponse(category);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const updated = await categoryService.updateById(id, data);
    if (!updated) {
      return FailureResponse("Category not found", 404);
    }
    return SuccessResponse(updated);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    await categoryService.deleteById(id);
    return SuccessResponse(true);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
