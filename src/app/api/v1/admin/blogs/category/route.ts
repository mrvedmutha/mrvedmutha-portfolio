import { NextRequest } from "next/server";
import { categoryService } from "@/services/admin/blogs/category.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export async function GET(req: NextRequest) {
  try {
    const categories = await categoryService.getAll();
    return SuccessResponse(categories);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
