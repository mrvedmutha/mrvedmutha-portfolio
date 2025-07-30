import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { CommentService } from "@/services/public/comments.services";

// GET: Fetch comments for a specific blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'best';

    const comments = await CommentService.getCommentsByBlogId(blogId, sort);

    return NextResponse.json({
      success: true,
      data: comments,
      total: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 
                   message.includes("not available") ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// POST: Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const body = await request.json();

    // Get user session from public auth
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

    const { content, parentId, useRealName, showEmail } = body;

    const savedComment = await CommentService.createComment({
      content,
      parentId,
      useRealName,
      showEmail,
      blogId,
      user: {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
        provider: token.provider as string,
        isAdmin: token.isAdmin as boolean,
      }
    });

    return NextResponse.json({
      success: true,
      data: savedComment,
      message: "Comment posted successfully",
    });
    
  } catch (error) {
    console.error("Error creating comment:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("required") || message.includes("too long") ? 400 :
                   message.includes("not found") ? 404 :
                   message.includes("not allowed") ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}