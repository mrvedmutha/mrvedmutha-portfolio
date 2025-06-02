import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { uploadToCloudinary } from "@/services/admin/common/cloudinary.services";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return FailureResponse("Unauthorized", 401);
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return FailureResponse("No file uploaded", 400);
  }

  // Read file as buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadToCloudinary(buffer, 1); // index can be dynamic if multiple files
    console.log("Cloudinary URL:", result.secure_url); //TODO: Remove this
    return SuccessResponse({ url: result.secure_url, result });
  } catch (error: any) {
    return FailureResponse(error.message || "Upload failed", 500);
  }
}
