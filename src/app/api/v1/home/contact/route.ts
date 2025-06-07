import { NextRequest } from "next/server";
import { SuccessResponse, FailureResponse } from "@/lib/common/responses";
import { contactZodSchema } from "@/schemas/zod/admin/pages/contact.zod.schema";
import { contactusService } from "@/services/home/contactus.services";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactZodSchema.safeParse(body);
    if (!parsed.success) {
      return FailureResponse(
        parsed.error.errors.map((e) => e.message).join(", ")
      );
    }
    const { name, email, message, recaptchaToken } = parsed.data;

    // Verify reCAPTCHA with Google
    const recaptchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.GOOGLE_RECAPTCHA_V2_SECRET,
          response: recaptchaToken,
        },
      }
    );
    if (!recaptchaRes.data.success) {
      return FailureResponse("reCAPTCHA validation failed.", 400);
    }

    // Only pass name, email, message to the service
    const saved = await contactusService.create({ name, email, message });
    return SuccessResponse(saved);
  } catch (error: any) {
    return FailureResponse(error.message || "Something went wrong.");
  }
}

export async function GET() {
  try {
    const messages = await contactusService.getAll();
    return SuccessResponse(messages);
  } catch (error: any) {
    return FailureResponse(
      error.message || "Failed to fetch contact messages."
    );
  }
}
