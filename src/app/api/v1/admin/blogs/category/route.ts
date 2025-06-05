import { NextRequest } from "next/server";
import { categoryService } from "@/services/admin/blogs/category.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const categories = await categoryService.getAll();
    return SuccessResponse(categories);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
