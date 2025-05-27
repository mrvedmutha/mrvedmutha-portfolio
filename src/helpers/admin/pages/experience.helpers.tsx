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
import { format } from "date-fns";
import ExperienceActionsCell from "@/components/admin/pages/experience/ExperienceActionsCell";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
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
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return "-";
      try {
        return format(new Date(value), "MMM-yy");
      } catch {
        return value;
      }
    },
  },
  {
    accessorKey: "toDate",
    header: "To",
    cell: (info) => {
      const row = info.row.original;
      if (row.currentlyWorking) return "Present";
      if (!row.toDate) return "-";
      try {
        return format(new Date(row.toDate), "MMM-yy");
      } catch {
        return row.toDate;
      }
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
        <ExperienceActionsCell
          experience={experience}
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
