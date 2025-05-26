import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IExperience } from "@/types/admin/pages/experience.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

const getColumns = (
  router: ReturnType<typeof useRouter>
): ColumnDef<IExperience>[] => [
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "fromDate",
    header: "From",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "toDate",
    header: "To",
    cell: (info) => {
      const row = info.row.original;
      return row.currentlyWorking ? "Present" : row.toDate || "-";
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (info) => {
      const tags = info.getValue() as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (info) => {
      const experience = info.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/pages/experience/edit/${experience._id}`)
              }
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                /* handle delete */
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default getColumns;
