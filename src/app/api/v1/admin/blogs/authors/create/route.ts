import { NextRequest } from "next/server";
import { authorService } from "@/services/admin/blogs/author.services";
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
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};
    let avatarBuffer: Buffer | undefined = undefined;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data.name = formData.get("name") as string;
      data.email = formData.get("email") as string;
      const avatarFile = formData.get("avatar") as File | null;
      if (avatarFile) {
        avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
      }
    } else {
      data = await req.json();
    }
    const author = await authorService.create({ ...data, avatarBuffer });
    return SuccessResponse(author, 201);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
