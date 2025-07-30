"use client";

import React, { useState } from 'react';
import { Send, User, UserX, Eye, EyeOff } from 'lucide-react';
import { PublicAuth } from './PublicAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { CommentFormData } from '@/types/comments/comment.types';
import { AnonymousNameGenerator } from '@/utils/comments/anonymous-name-generator';

interface CommentFormProps {
  parentId?: string;
  placeholder?: string;
  onSubmit: (data: CommentFormData) => void;
  onCancel?: () => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    image: string;
    provider: string;
    isAdmin?: boolean;
  } | null;
}

export function CommentForm({
  parentId,
  placeholder = "What are your thoughts?",
  onSubmit,
  onCancel,
  currentUser,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser?.isAdmin || false;
  
  // Admin users must use real name, regular users can choose
  const [useRealName, setUseRealName] = useState(true);
  const canToggleAnonymous = !isAdmin;

  // Generate anonymous name for preview
  const anonymousName = currentUser 
    ? AnonymousNameGenerator.generateForUser(currentUser.id)
    : 'AnonymousUser';
  const anonymousAvatar = AnonymousNameGenerator.getAvatarUrl(anonymousName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        parentId,
        useRealName,
        showEmail,
      });
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = useRealName ? currentUser?.name : anonymousName;
  const displayAvatar = useRealName ? currentUser?.image : anonymousAvatar;

  if (!currentUser) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <div className="mb-4">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
          <p className="text-muted-foreground mb-4">
            Sign in with Google or GitHub to share your thoughts
          </p>
          <PublicAuth />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Preview */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback>
                {displayName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                Commenting as: {displayName}
              </span>
              
              {!useRealName && (
                <Badge variant="secondary" className="text-xs">
                  Anonymous
                </Badge>
              )}
              
              {showEmail && useRealName && (
                <Badge variant="outline" className="text-xs">
                  Email visible
                </Badge>
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/1000
            </div>
          </div>

          <Separator />

          {/* Privacy Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {useRealName ? <User className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                <Label htmlFor="use-real-name" className="text-sm">
                  Use real name ({currentUser.name})
                  {isAdmin && <Badge variant="destructive" className="ml-2 text-xs">Admin</Badge>}
                </Label>
              </div>
              <Switch
                id="use-real-name"
                checked={useRealName}
                onCheckedChange={canToggleAnonymous ? setUseRealName : undefined}
                disabled={!canToggleAnonymous}
              />
            </div>

            {isAdmin && (
              <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                🔒 Admin users must use their real name and cannot comment anonymously
              </div>
            )}

            {useRealName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <Label htmlFor="show-email" className="text-sm">
                    Show email address
                  </Label>
                </div>
                <Switch
                  id="show-email"
                  checked={showEmail}
                  onCheckedChange={setShowEmail}
                />
              </div>
            )}

            {!useRealName && (
              <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                💡 Your anonymous name is consistent across this blog but different on other blogs
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting || content.length > 1000}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}