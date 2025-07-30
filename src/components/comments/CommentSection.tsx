"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, SortAsc, RefreshCw, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCommentAuth } from '@/hooks/comments/useCommentAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { Comment, CommentFormData } from '@/types/comments/comment.types';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  blogId: string;
  allowComments: boolean;
}

type SortOption = 'best' | 'top' | 'new' | 'controversial';

export function CommentSection({
  blogId,
  allowComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [refreshing, setRefreshing] = useState(false);

  const { currentUser, isAdmin } = useCommentAuth();

  const handleSignOut = async () => {
    // If user is admin, sign out from admin session
    if (isAdmin) {
      await signOut({ callbackUrl: '/auth' });
    } else {
      // Sign out from public session
      await signOut();
    }
  };

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/public/blogs/${blogId}/comments?sort=${sortBy}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [blogId, sortBy]);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleCommentSubmit = async (formData: CommentFormData) => {
    try {
      console.log('Submitting comment:', formData);
      const response = await fetch(`/api/v1/public/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadComments(); // Refresh comments
      } else {
        const errorData = await response.json();
        console.error('Comment submission failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReply = (parentId: string) => {
    // Handle reply logic
    console.log('Reply to:', parentId);
  };

  const handleEdit = (commentId: string) => {
    // Handle edit logic
    console.log('Edit comment:', commentId);
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/v1/public/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleVote = async (commentId: string, vote: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/v1/public/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });

      if (response.ok) {
        await loadComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleReport = async (commentId: string, reason: string) => {
    try {
      const response = await fetch(`/api/v1/public/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        // Show success message
        console.log('Comment reported successfully');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  // Build comment tree for threading
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: Comment[] = [];

    // Create map and initialize replies array
    comments.forEach(comment => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    // Build the tree
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment._id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const sortComments = (comments: Comment[]): Comment[] => {
    switch (sortBy) {
      case 'best':
        return [...comments].sort((a, b) => b.votes.score - a.votes.score);
      case 'top':
        return [...comments].sort((a, b) => b.votes.upvotes - a.votes.upvotes);
      case 'new':
        return [...comments].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'controversial':
        return [...comments].sort((a, b) => {
          const aControversy = Math.min(a.votes.upvotes, a.votes.downvotes);
          const bControversy = Math.min(b.votes.upvotes, b.votes.downvotes);
          return bControversy - aControversy;
        });
      default:
        return comments;
    }
  };

  if (!allowComments) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Comments are disabled</h3>
          <p className="text-muted-foreground">
            The author has disabled comments for this post.
          </p>
        </CardContent>
      </Card>
    );
  }

  const threadedComments = buildCommentTree(sortComments(comments));
  const totalComments = comments.length;
  const activeComments = comments.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments
                <Badge variant="secondary">
                  {totalComments}
                </Badge>
              </CardTitle>
              
              {activeComments !== totalComments && (
                <Badge variant="outline" className="text-xs">
                  {activeComments} active
                </Badge>
              )}

              {/* User Info and Signout */}
              {currentUser && (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="h-8"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Signed in as {currentUser.email}
                    {isAdmin && <Badge variant="destructive" className="ml-2 text-xs">Admin</Badge>}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Options */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="controversial">Controversial</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comment Form */}
      <CommentForm
        onSubmit={handleCommentSubmit}
        currentUser={currentUser ? { ...currentUser, isAdmin } : null}
        placeholder="Share your thoughts on this post..."
      />

      <Separator />

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : threadedComments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          threadedComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={(comment as any).replies || []}
              currentUserId={currentUser?.id || null}
              currentUser={currentUser}
              isAdmin={isAdmin}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVote={handleVote}
              onReport={handleReport}
            />
          ))
        )}
      </div>
    </div>
  );
}