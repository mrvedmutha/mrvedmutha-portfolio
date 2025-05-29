import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { socialService } from "@/services/admin/pages/social.services";
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
    const social = await socialService.create(body);
    return SuccessResponse(social, 201);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to create social", 500);
  }
}
