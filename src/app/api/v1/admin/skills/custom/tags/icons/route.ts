import { NextResponse } from "next/server";
import { skillService } from "@/services/admin/pages/skill.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export async function GET() {
  try {
    const icons = await skillService.getAllTagIcons();
    return SuccessResponse(icons, 200);
  } catch (error: any) {
    return FailureResponse(error.message, 500);
  }
}
