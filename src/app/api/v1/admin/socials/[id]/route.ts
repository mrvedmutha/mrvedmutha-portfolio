import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { socialService } from "@/services/admin/pages/social.services";
import { authOptions } from "@/lib/auth/options";
import { dbConnect } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const social = await socialService.getById(id);
    if (!social) return FailureResponse("Social not found", 404);
    return SuccessResponse(social);
  } catch (err) {
    return FailureResponse("Failed to fetch social", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return FailureResponse("Unauthorized", 401);
  try {
    const body = await req.json();
    const { id } = await params;
    const updated = await socialService.updateById(id, body);
    if (!updated) return FailureResponse("Social not found", 404);
    return SuccessResponse(updated);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to update social", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return FailureResponse("Unauthorized", 401);
  try {
    const { id } = await params;
    await socialService.deleteById(id);
    return SuccessResponse({ message: "Social deleted" }, 200);
  } catch (err) {
    return FailureResponse("Failed to delete social", 500);
  }
}
