import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { CommentService } from "@/services/public/comments.services";

// GET: Get a specific comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const comment = await CommentService.getCommentById(commentId);

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// PUT: Update a comment
export async function PUT(
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

    const { content, editReason } = body;

    const updatedComment = await CommentService.updateComment(
      commentId, 
      token.id as string, 
      { content, editReason }
    );

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 :
                   message.includes("authorized") ? 403 :
                   message.includes("15 minutes") ? 400 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// DELETE: Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason');

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

    const deletedComment = await CommentService.deleteComment(commentId, {
      userId: token.id as string,
      userRole: token.isAdmin ? 'admin' : 'user',
      displayName: token.name as string,
      reason: reason || undefined,
    });

    return NextResponse.json({
      success: true,
      data: deletedComment,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 :
                   message.includes("authorized") ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}