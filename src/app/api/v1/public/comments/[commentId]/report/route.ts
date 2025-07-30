import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { CommentService } from "@/services/public/comments.services";

// POST: Report a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();

    // Get user session
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { reason } = body;

    if (!reason?.trim()) {
      return NextResponse.json(
        { success: false, message: "Reason is required for reporting" },
        { status: 400 }
      );
    }

    const updatedComment = await CommentService.reportComment(
      commentId, 
      token.id as string, 
      reason
    );

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: "Comment reported successfully",
    });
  } catch (error) {
    console.error("Error reporting comment:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 :
                   message.includes("already reported") ? 409 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}