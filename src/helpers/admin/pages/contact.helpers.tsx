import { ColumnDef } from "@tanstack/react-table";
import { IContactMessage } from "@/types/admin/pages/contact.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
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

const getColumns = (
  onDelete?: (id: string) => void
): ColumnDef<IContactMessage>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [alertOpen, setAlertOpen] = useState(false);
      const message = row.original.message;
      return (
        <>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                    <Eye className="w-4 h-4 mr-2" /> View Message
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setAlertOpen(true)}
                    className="text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700 dark:data-[highlighted]:bg-red-900 dark:data-[highlighted]:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* View Message Dialog */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Message</DialogTitle>
                  <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
              </DialogContent>
              {/* Delete Confirmation Dialog */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this contact message?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the contact message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setAlertOpen(false);
                      if (onDelete) onDelete(row.original._id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Dialog>
        </>
      );
    },
  },
];

export default getColumns;
