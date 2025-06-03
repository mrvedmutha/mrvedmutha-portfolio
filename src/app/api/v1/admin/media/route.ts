// src/app/api/v1/admin/media/route.ts
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export async function GET(req: NextRequest) {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:mrvedmutha/portfolio/blog/content")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();
    return SuccessResponse(resources, 200);
  } catch (error: any) {
    return FailureResponse(error.message, 500);
  }
}
