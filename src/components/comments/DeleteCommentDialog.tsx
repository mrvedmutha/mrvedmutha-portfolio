"use client";

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DeleteCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
  isAdmin: boolean;
  commentAuthor?: string;
}

export function DeleteCommentDialog({
  open,
  onOpenChange,
  onConfirm,
  isAdmin,
  commentAuthor,
}: DeleteCommentDialogProps) {
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(reason.trim() || undefined);
      setReason('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Comment
          </DialogTitle>
          <DialogDescription>
            {isAdmin ? (
              <>
                Are you sure you want to delete this comment
                {commentAuthor && ` by ${commentAuthor}`}? This action cannot be undone.
              </>
            ) : (
              "Are you sure you want to delete your comment? This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>

        {isAdmin && (
          <div className="space-y-2">
            <Label htmlFor="deletion-reason" className="text-sm font-medium">
              Reason for deletion (optional)
            </Label>
            <Textarea
              id="deletion-reason"
              placeholder="Enter reason for deleting this comment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground text-right">
              {reason.length}/200
            </div>
          </div>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Trash2 className="mr-2 h-4 w-4 animate-pulse" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Comment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}