import { NextRequest } from "next/server";
import { authorService } from "@/services/admin/blogs/author.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { dbConnect } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const author = await authorService.getById(id);
    if (!author) {
      return FailureResponse("Author not found", 404);
    }
    return SuccessResponse(author);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { id } = await params;
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
    const updated = await authorService.updateById(id, {
      ...data,
      avatarBuffer,
    });
    if (!updated) {
      return FailureResponse("Author not found", 404);
    }
    return SuccessResponse(updated);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return FailureResponse(
      "Unauthorized: Please log in to perform this action",
      401
    );
  }
  try {
    const { id } = await params;
    await authorService.deleteById(id);
    return SuccessResponse(true);
  } catch (error: any) {
    return FailureResponse(error.message, 400);
  }
}
