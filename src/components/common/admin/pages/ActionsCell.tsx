import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AdminActionsCellProps<T extends { _id: string }> {
  entity: T;
  editPath: string; // e.g. "/admin/pages/education/edit/"
  entityLabel: string; // e.g. "education"
  router: ReturnType<typeof import("next/navigation").useRouter>;
  onDelete?: (id: string) => void;
}

function AdminActionsCell<T extends { _id: string }>({
  entity,
  editPath,
  entityLabel,
  router,
  onDelete,
}: AdminActionsCellProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`${editPath}${entity._id}`)}
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700 dark:data-[highlighted]:bg-red-900 dark:data-[highlighted]:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Are you sure you want to delete this ${entityLabel}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete the ${entityLabel}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              if (onDelete) onDelete(entity._id);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AdminActionsCell;
