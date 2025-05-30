import { NextRequest } from "next/server";
import { tagService } from "@/services/admin/blogs/tag.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
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
    const data = await req.json();
    const tag = await tagService.create(data);
    return SuccessResponse(tag, 201);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
