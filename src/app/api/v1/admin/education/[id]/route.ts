import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { educationService } from "@/services/admin/pages/education.services";
import { authOptions } from "@/lib/auth/options";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const education = await educationService.getById(id);
    if (!education) return FailureResponse("Education not found", 404);
    return SuccessResponse(education);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to fetch education", 500);
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
    const updated = await educationService.updateById(id, body);
    if (!updated) return FailureResponse("Education not found", 404);
    return SuccessResponse(updated);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to update education", 500);
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
    await educationService.deleteById(id);
    return SuccessResponse({ message: "Education deleted" }, 200);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to delete education", 500);
  }
}
