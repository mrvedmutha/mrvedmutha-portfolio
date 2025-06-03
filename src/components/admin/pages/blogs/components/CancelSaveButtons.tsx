"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelSaveButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  loading: boolean;
  saveLabel?: string;
}

const CancelSaveButtons: React.FC<CancelSaveButtonsProps> = ({
  onCancel,
  onSave,
  loading,
  saveLabel = "Save",
}) => (
  <div className="flex gap-2 mb-4">
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex-1" type="button">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
          <AlertDialogDescription>
            Any information you have entered will not be restored.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Editing</AlertDialogCancel>
          <AlertDialogAction onClick={onCancel}>Yes, Cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Button
      variant="default"
      className="flex-1"
      onClick={onSave}
      disabled={loading}
    >
      {loading ? "Saving..." : saveLabel}
    </Button>
  </div>
);

export default CancelSaveButtons;
