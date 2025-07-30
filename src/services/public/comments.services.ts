import { dbConnect } from "@/lib/db";
import { Blog } from "@/models/admin/blogs/blog.model";
import { Comment } from "@/models/admin/blogs/comment.model";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import { AnonymousNameGenerator } from "@/utils/comments/anonymous-name-generator";

export interface CreateCommentData {
  content: string;
  parentId?: string;
  useRealName: boolean;
  showEmail: boolean;
  blogId: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    provider?: string;
    isAdmin?: boolean;
  };
}

export interface UpdateCommentData {
  content: string;
  editReason?: string;
}

export interface DeleteCommentData {
  userId: string;
  userRole: 'user' | 'admin';
  displayName: string;
  reason?: string;
}

export class CommentService {
  static async getCommentsByBlogId(blogId: string, sortBy: string = 'best') {
    await dbConnect();

    // Find the blog and check if comments are allowed
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.status !== BlogStatus.PUBLISHED || !blog.allowComments) {
      throw new Error("Comments not available for this blog");
    }

    // Get all comments for this blog
    let commentsQuery = Comment.find({ 
      blogId,
      status: { $in: ['active', 'edited'] } // Don't show deleted comments
    });

    // Apply sorting
    switch (sortBy) {
      case 'best':
        commentsQuery = commentsQuery.sort({ 'votes.score': -1, createdAt: -1 });
        break;
      case 'top':
        commentsQuery = commentsQuery.sort({ 'votes.upvotes': -1, createdAt: -1 });
        break;
      case 'new':
        commentsQuery = commentsQuery.sort({ createdAt: -1 });
        break;
      case 'controversial':
        // Sort by comments with most engagement (up+down votes)
        commentsQuery = commentsQuery.sort({ 'votes.upvotes': -1, 'votes.downvotes': -1 });
        break;
      default:
        commentsQuery = commentsQuery.sort({ 'votes.score': -1, createdAt: -1 });
    }

    const comments = await commentsQuery.exec();
    return comments;
  }

  static async createComment(data: CreateCommentData) {
    await dbConnect();

    const { content, parentId, useRealName, showEmail, blogId, user } = data;

    // Validate content
    if (!content?.trim()) {
      throw new Error("Content is required");
    }

    if (content.length > 1000) {
      throw new Error("Content too long (max 1000 characters)");
    }

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if comments are allowed
    if (blog.status !== BlogStatus.PUBLISHED || !blog.allowComments) {
      throw new Error("Comments are not allowed for this blog");
    }

    // Handle parent comment (for replies)
    let depth = 0;
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      
      // Only allow 2 levels: Comment (depth 0) and Reply (depth 1)
      if (parentComment.depth > 0) {
        throw new Error("Cannot reply to a reply. Only replies to main comments are allowed.");
      }
      
      depth = 1; // All replies are depth 1
    }

    // Generate display name and avatar
    const displayName = useRealName 
      ? user.name || 'Anonymous User'
      : AnonymousNameGenerator.generateForUser(user.id);
    
    const avatar = useRealName 
      ? (user.image && user.image.trim()) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&bold=true&size=128`
      : AnonymousNameGenerator.getAvatarUrl(displayName);

    // Ensure avatar is never empty
    if (!avatar || !avatar.trim()) {
      throw new Error("Avatar generation failed");
    }

    // Create the comment
    const newComment = new Comment({
      content: content.trim(),
      author: {
        userId: user.id,
        displayName,
        avatar,
        isAnonymous: !useRealName,
        provider: user.provider || 'unknown',
        email: (useRealName && showEmail) ? user.email : undefined,
      },
      parentId: parentId || null,
      depth,
      blogId,
      status: 'active',
    });

    // Save the comment
    const savedComment = await newComment.save();

    // If it's a reply, add to parent's replies array
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: savedComment._id }
      });
    }

    return savedComment;
  }

  static async updateComment(commentId: string, userId: string, data: UpdateCommentData) {
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user owns the comment
    if (comment.author.userId !== userId) {
      throw new Error("Not authorized to edit this comment");
    }

    // Check if comment can be edited (within 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.createdAt < fifteenMinutesAgo && !data.editReason) {
      throw new Error("Comment can only be edited within 15 minutes of posting");
    }

    // Save edit history
    if (comment.content !== data.content.trim()) {
      comment.editHistory.push({
        previousContent: comment.content,
        editedAt: new Date(),
        editReason: data.editReason,
      });
    }

    // Update comment
    comment.content = data.content.trim();
    comment.isEdited = true;
    comment.status = 'edited';
    comment.updatedAt = new Date();

    const updatedComment = await comment.save();
    return updatedComment;
  }

  static async deleteComment(commentId: string, deleteData: DeleteCommentData) {
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check authorization
    const canDelete = deleteData.userRole === 'admin' || comment.author.userId === deleteData.userId;
    if (!canDelete) {
      throw new Error("Not authorized to delete this comment");
    }

    // Soft delete - keep the comment but mark as deleted
    const deleteStatus = deleteData.userRole === 'admin' ? 'deleted_by_admin' : 'deleted_by_user';
    
    comment.status = deleteStatus;
    comment.deletedAt = new Date();
    comment.deletedBy = {
      userId: deleteData.userId,
      displayName: deleteData.displayName,
      role: deleteData.userRole,
    };
    comment.deletionReason = deleteData.reason || null;

    const deletedComment = await comment.save();
    return deletedComment;
  }

  static async voteComment(commentId: string, userId: string, vote: 'up' | 'down') {
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Find existing vote
    const existingVoteIndex = comment.votes.userVotes.findIndex((v: any) => v.userId === userId);
    let previousVote: 'up' | 'down' | null = null;

    if (existingVoteIndex >= 0) {
      previousVote = comment.votes.userVotes[existingVoteIndex].vote;
      // Remove existing vote
      comment.votes.userVotes.splice(existingVoteIndex, 1);
    }

    // Update vote counts
    if (previousVote === 'up') {
      comment.votes.upvotes -= 1;
    } else if (previousVote === 'down') {
      comment.votes.downvotes -= 1;
    }

    // Add new vote if different from previous or if no previous vote
    if (previousVote !== vote) {
      comment.votes.userVotes.push({ userId, vote });
      
      if (vote === 'up') {
        comment.votes.upvotes += 1;
      } else {
        comment.votes.downvotes += 1;
      }
    }

    // Update score
    comment.votes.score = comment.votes.upvotes - comment.votes.downvotes;

    const updatedComment = await comment.save();
    return updatedComment;
  }

  static async reportComment(commentId: string, userId: string, reason: string) {
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user already reported this comment
    const existingReport = comment.reports.find((r: any) => r.reportedBy === userId);
    if (existingReport) {
      throw new Error("You have already reported this comment");
    }

    // Add report
    comment.reports.push({
      reportedBy: userId,
      reason: reason.trim(),
      reportedAt: new Date(),
    });

    comment.isReported = true;

    const updatedComment = await comment.save();
    return updatedComment;
  }

  static async getCommentById(commentId: string) {
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    return comment;
  }
}