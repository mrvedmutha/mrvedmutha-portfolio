import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import type { NextRequest } from "next/server";
import { sectionsService } from "@/services/admin/pages/sections.services";
import Sections from "@/models/admin/pages/sections.model";
import { dbConnect } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const section = await sectionsService.getById(id);
      if (!section) return FailureResponse("Section not found", 404);
      return SuccessResponse(section, 200);
    }
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const [sections, total] = await Promise.all([
      sectionsService.getAll(limit, skip),
      Sections.countDocuments({}),
    ]);
    return SuccessResponse({ data: sections, total }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch sections", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const section = await sectionsService.create(body);
    return SuccessResponse(section, 201);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to create section", 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return FailureResponse("Section id is required", 400);
    const body = await req.json();
    const updated = await sectionsService.updateById(id, body);
    if (!updated) return FailureResponse("Section not found", 404);
    return SuccessResponse(updated, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to update section", 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return FailureResponse("Section id is required", 400);
    await sectionsService.deleteById(id);
    return SuccessResponse({ message: "Section deleted" }, 200);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to delete section", 400);
  }
}
