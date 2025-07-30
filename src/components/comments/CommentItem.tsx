"use client";

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, MoreHorizontal, Reply, Edit, Trash2, Flag, ArrowUp, ArrowDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Comment, CommentActionProps } from '@/types/comments/comment.types';
import { CommentForm } from './CommentForm';
import { CommentEditForm } from './CommentEditForm';
import { DeleteCommentDialog } from './DeleteCommentDialog';
import { ReportCommentDialog } from './ReportCommentDialog';

interface CommentItemProps extends CommentActionProps {
  replies?: Comment[];
  maxDepth?: number;
}

export function CommentItem({
  comment,
  replies = [],
  currentUserId,
  currentUser,
  isAdmin,
  maxDepth = 5,
  onReply,
  onEdit,
  onDelete,
  onVote,
  onReport,
}: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(
    currentUserId 
      ? comment.votes.userVotes.find(v => v.userId === currentUserId)?.vote || null
      : null
  );

  // More robust comparison for user IDs (handle both string and ObjectId formats)
  const isOwnComment = currentUserId && comment.author.userId && 
    (currentUserId === comment.author.userId || 
     currentUserId === comment.author.userId.toString() ||
     currentUserId.toString() === comment.author.userId);
  
  const canEdit = isOwnComment && comment.status === 'active';
  const canDelete = isOwnComment || isAdmin;
  const hasReplies = replies.length > 0;
  const isDeleted = comment.status.includes('deleted');

  const handleVote = (vote: 'up' | 'down') => {
    if (!currentUserId) return;
    
    const newVote = userVote === vote ? null : vote;
    setUserVote(newVote);
    onVote(comment._id, vote);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (reason?: string) => {
    await onDelete(comment._id);
  };

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const handleConfirmReport = async (reason: string) => {
    await onReport(comment._id, reason);
  };

  const renderDeletedComment = () => (
    <Card className="border-l-4 border-l-muted bg-muted/30">
      <CardContent className="py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trash2 className="h-4 w-4" />
          {comment.status === 'deleted_by_user' && '[Comment deleted by user]'}
          {comment.status === 'deleted_by_admin' && (
            <span>
              [Comment removed by admin
              {comment.deletionReason && `: ${comment.deletionReason}`}]
            </span>
          )}
        </div>
        {hasReplies && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs"
            >
              {isCollapsed ? 'Show' : 'Hide'} {replies.length} replies
              {isCollapsed ? <ChevronDown className="ml-1 h-3 w-3" /> : <ChevronUp className="ml-1 h-3 w-3" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isDeleted) {
    return (
      <div className="comment-thread">
        {renderDeletedComment()}
        {hasReplies && !isCollapsed && (
          <div className="ml-6 mt-2 border-l-2 border-muted pl-4 space-y-3">
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                replies={[]} // Replies will be loaded separately
                currentUserId={currentUserId}
                currentUser={currentUser}
                isAdmin={isAdmin}
                maxDepth={maxDepth}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onVote={onVote}
                onReport={onReport}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="comment-thread">
      <Card className="transition-colors hover:bg-muted/20">
        <CardContent className="py-4">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.displayName} />
                <AvatarFallback>
                  {comment.author.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {comment.author.displayName}
                </span>
                
                {comment.author.isAnonymous && (
                  <Badge variant="secondary" className="text-xs">
                    Anonymous
                  </Badge>
                )}
                
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                
                {comment.isEdited && (
                  <Badge variant="outline" className="text-xs">
                    edited
                  </Badge>
                )}
                
                {comment.isReported && isAdmin && (
                  <Badge variant="destructive" className="text-xs">
                    reported
                  </Badge>
                )}
              </div>
            </div>

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
                {!isOwnComment && currentUserId && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleReport}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <CommentEditForm
              comment={comment}
              onSave={(content) => {
                onEdit(comment._id);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="prose prose-sm max-w-none mb-3 text-foreground">
              {comment.content}
            </div>
          )}

          <Separator className="my-3" />

          {/* Comment Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Vote Buttons */}
              <div className="flex items-center gap-1 mr-4">
                <Button
                  variant={userVote === 'up' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleVote('up')}
                  disabled={!currentUserId}
                  className="h-8 px-2"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium min-w-[2rem] text-center">
                  {comment.votes.score}
                </span>
                
                <Button
                  variant={userVote === 'down' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleVote('down')}
                  disabled={!currentUserId}
                  className="h-8 px-2"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Reply Button - Only allow replies to top-level comments */}
              {currentUserId && comment.depth === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="h-8"
                >
                  <Reply className="mr-1 h-4 w-4" />
                  Reply
                </Button>
              )}
            </div>

            {/* Collapse Replies Button */}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8"
              >
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                {isCollapsed ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 pt-4 border-t">
              <CommentForm
                parentId={comment._id}
                onSubmit={async (data) => {
                  try {
                    const response = await fetch(`/api/v1/public/blogs/${comment.blogId}/comments`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                    });

                    if (response.ok) {
                      setShowReplyForm(false);
                      // Trigger parent to refresh comments
                      onReply(comment._id);
                    } else {
                      const errorData = await response.json();
                      console.error('Reply submission failed:', errorData);
                    }
                  } catch (error) {
                    console.error('Error submitting reply:', error);
                  }
                }}
                onCancel={() => setShowReplyForm(false)}
                currentUser={currentUser ? { ...currentUser, isAdmin } : null}
                placeholder={`Reply to ${comment.author.displayName}...`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {hasReplies && !isCollapsed && (
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <div className="ml-6 mt-3 border-l-2 border-muted pl-4 space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  replies={[]} // Replies will be loaded separately for performance
                  currentUserId={currentUserId}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onVote={onVote}
                  onReport={onReport}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteCommentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        isAdmin={isAdmin}
        commentAuthor={comment.author.displayName}
      />

      {/* Report Comment Dialog */}
      <ReportCommentDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onConfirm={handleConfirmReport}
        commentAuthor={comment.author.displayName}
      />
    </div>
  );
}