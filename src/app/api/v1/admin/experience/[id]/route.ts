import { NextRequest } from "next/server";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { experienceService } from "@/services/admin/pages/experience.services";
import { experienceZodSchema } from "@/schemas/zod/admin/pages/experience.zod.schema";
import { dbConnect } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const experience = await experienceService.getById(id);
    if (!experience) return FailureResponse("Experience not found", 404);
    return SuccessResponse(experience);
  } catch (err) {
    return FailureResponse("Failed to fetch experience", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const parse = experienceZodSchema.safeParse(body);
    if (!parse.success) {
      return FailureResponse("Invalid data", 400);
    }
    const { id } = await params;
    const updated = await experienceService.updateById(id, parse.data);
    if (!updated) return FailureResponse("Experience not found", 404);
    return SuccessResponse(updated);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to update experience", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await experienceService.deleteById(id);
    return SuccessResponse({ message: "Experience deleted" }, 200);
  } catch (err) {
    return FailureResponse("Failed to delete experience", 500);
  }
}
