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

function ContactActionsCell({
  contact,
  onDelete,
  id,
}: {
  contact: IContactMessage;
  onDelete?: (id: string) => void;
  id: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
              <DialogDescription>
                Message received on {new Date(contact.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm">{contact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{contact.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm">{contact.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interested In</label>
                <p className="text-sm">{contact.interestedIn}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Budget Range</label>
                <p className="text-sm">{contact.budgetRange}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="text-sm">{contact.currency}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-sm">{contact.country}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          </DialogContent>
          {/* Delete Confirmation Dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this contact message?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                contact message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setAlertOpen(false);
                  if (onDelete) onDelete(id);
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
}

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
    accessorKey: "phone",
    header: "Phone",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "interestedIn",
    header: "Service",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "budgetRange",
    header: "Budget",
    cell: ({ row }) => `${row.original.budgetRange} ${row.original.currency}`,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ContactActionsCell
        contact={row.original}
        onDelete={onDelete}
        id={row.original._id}
      />
    ),
  },
];

export default getColumns;
