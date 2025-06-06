import { NextResponse } from "next/server";
import { skillService } from "@/services/admin/pages/skill.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export async function GET() {
  try {
    const titles = await skillService.getAllSkillTitles();
    return SuccessResponse(titles, 200);
  } catch (error: any) {
    return FailureResponse(error.message, 500);
  }
}
