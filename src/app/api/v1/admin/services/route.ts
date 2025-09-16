import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { serviceService } from "@/services/admin/pages/service.services";
import type { NextRequest } from "next/server";
import { Service } from "@/models/admin/pages/service.model";
import { dbConnect } from "@/lib/db";
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [services, total] = await Promise.all([
      serviceService.getAll(limit, skip),
      Service.countDocuments({}),
    ]);
    return SuccessResponse({ data: services, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch services", 500);
  }
}