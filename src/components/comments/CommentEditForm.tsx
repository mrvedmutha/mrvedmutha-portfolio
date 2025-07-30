"use client";

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

import { Comment } from '@/types/comments/comment.types';

interface CommentEditFormProps {
  comment: Comment;
  onSave: (content: string, reason?: string) => void;
  onCancel: () => void;
}

export function CommentEditForm({
  comment,
  onSave,
  onCancel,
}: CommentEditFormProps) {
  const [content, setContent] = useState(comment.content);
  const [editReason, setEditReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(content.trim(), editReason.trim() || undefined);
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = content.trim() !== comment.content;
  const canSave = hasChanges && content.trim().length > 0 && content.length <= 1000;

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Edit indicator */}
          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Editing comment
          </div>

          {/* Content editor */}
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Edit your comment..."
              disabled={isSubmitting}
              autoFocus
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {hasChanges ? 'You have unsaved changes' : 'No changes made'}
              </span>
              <span className={content.length > 1000 ? 'text-destructive' : ''}>
                {content.length}/1000
              </span>
            </div>
          </div>

          {/* Optional edit reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Edit reason (optional)
            </label>
            <Textarea
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              className="min-h-[60px] resize-none"
              placeholder="Why are you editing this comment? (e.g., 'fixed typo', 'added clarification')"
              disabled={isSubmitting}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={!canSave || isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Edit time limit warning */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            💡 You can edit comments within 15 minutes of posting. After that, edits will require admin approval.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}