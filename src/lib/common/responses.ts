import { NextResponse } from "next/server";

export function SuccessResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function FailureResponse(error: string, status: number = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
