import { NextRequest } from "next/server";
import { tagService } from "@/services/admin/blogs/tag.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const tag = await tagService.getById(id);
    if (!tag) {
      return FailureResponse("Tag not found", 404);
    }
    return SuccessResponse(tag);
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
    const updated = await tagService.updateById(id, data);
    if (!updated) {
      return FailureResponse("Tag not found", 404);
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
    await tagService.deleteById(id);
    return SuccessResponse(true);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
