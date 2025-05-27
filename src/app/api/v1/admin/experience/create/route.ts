import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { experienceService } from "@/services/admin/pages/experience.services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const body = await req.json();
    const experience = await experienceService.create(body);
    return SuccessResponse(experience, 201);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to create experience", 500);
  }
}
