"use client";

import React, { useState } from 'react';
import { Flag } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  commentAuthor?: string;
}

const REPORT_REASONS = [
  'Spam or misleading',
  'Harassment or bullying',
  'Hate speech',
  'Violence or dangerous behavior',
  'Inappropriate content',
  'Copyright violation',
  'Other',
];

export function ReportCommentDialog({
  open,
  onOpenChange,
  onConfirm,
  commentAuthor,
}: ReportCommentDialogProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const isOtherReason = selectedReason === 'Other';
  const finalReason = isOtherReason ? customReason.trim() : selectedReason;
  const canSubmit = finalReason.length > 0;

  const handleConfirm = async () => {
    if (!canSubmit) return;

    setIsReporting(true);
    try {
      await onConfirm(finalReason);
      handleCancel();
    } catch (error) {
      console.error('Error reporting comment:', error);
    } finally {
      setIsReporting(false);
    }
  };

  const handleCancel = () => {
    setSelectedReason('');
    setCustomReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-orange-500" />
            Report Comment
          </DialogTitle>
          <DialogDescription>
            Why are you reporting this comment
            {commentAuthor && ` by ${commentAuthor}`}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason" className="text-sm font-medium">
              Reason for reporting *
            </Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isOtherReason && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please specify *
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Describe the issue with this comment..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground text-right">
                {customReason.length}/200
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isReporting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canSubmit || isReporting}
            className="w-full sm:w-auto"
          >
            {isReporting ? (
              <>
                <Flag className="mr-2 h-4 w-4 animate-pulse" />
                Reporting...
              </>
            ) : (
              <>
                <Flag className="mr-2 h-4 w-4" />
                Report Comment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}