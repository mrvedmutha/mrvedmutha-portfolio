import { NextRequest } from "next/server";
import { authorService } from "@/services/admin/blogs/author.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const authors = await authorService.getAll();
    return SuccessResponse(authors);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
