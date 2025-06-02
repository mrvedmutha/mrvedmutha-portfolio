import { v2 as cloudinary } from "cloudinary";
// @ts-ignore: No type definitions for cloudinary result object
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { ICloudinaryUploadResult } from "@/types/admin/common/cloudinary/cloudinary.types";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  index: number
): Promise<ICloudinaryUploadResult> {
  return new Promise<ICloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mrvedmutha/portfolio/blog/content",
        public_id: `mrved_port_blog_cont_${Date.now()}_${String(index).padStart(
          3,
          "0"
        )}`,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as ICloudinaryUploadResult);
        }
      }
    );
    stream.end(buffer);
  });
}
