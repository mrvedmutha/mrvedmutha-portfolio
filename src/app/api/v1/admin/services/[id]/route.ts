import { NextRequest } from "next/server";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { serviceService } from "@/services/admin/pages/service.services";
import { serviceZodSchema } from "@/schemas/zod/admin/pages/service.zod.schema";
import { dbConnect } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const service = await serviceService.getById(id);
    if (!service) return FailureResponse("Service not found", 404);
    return SuccessResponse(service);
  } catch (err) {
    return FailureResponse("Failed to fetch service", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const parse = serviceZodSchema.safeParse(body);
    if (!parse.success) {
      return FailureResponse("Invalid data", 400);
    }
    const { id } = await params;
    const updated = await serviceService.updateById(id, parse.data);
    if (!updated) return FailureResponse("Service not found", 404);
    return SuccessResponse(updated);
  } catch (err: any) {
    return FailureResponse(err.message || "Failed to update service", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await serviceService.deleteById(id);
    return SuccessResponse({ message: "Service deleted" }, 200);
  } catch (err) {
    return FailureResponse("Failed to delete service", 500);
  }
}