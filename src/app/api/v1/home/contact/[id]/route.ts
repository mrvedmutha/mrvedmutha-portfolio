import { NextRequest } from "next/server";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { contactusService } from "@/services/home/contactus.services";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const message = await contactusService.getById(id);
    if (!message) {
      return FailureResponse("Contact message not found.", 404);
    }
    return SuccessResponse(message);
  } catch (error: any) {
    return FailureResponse(error.message || "Failed to fetch contact message.");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await contactusService.deleteById(id);
    return SuccessResponse({ success: true });
  } catch (error: any) {
    return FailureResponse(
      error.message || "Failed to delete contact message."
    );
  }
}
