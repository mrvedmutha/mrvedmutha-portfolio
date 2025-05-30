import { NextRequest } from "next/server";
import { categoryService } from "@/services/admin/blogs/category.services";
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
    const category = await categoryService.create(data);
    return SuccessResponse(category, 201);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
