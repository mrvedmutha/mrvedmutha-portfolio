import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IExperience } from "@/types/admin/pages/experience.types";
import { format } from "date-fns";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<IExperience>[] => [
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "fromDate",
    header: "From",
    cell: (cell) => {
      const value = cell.getValue() as string;
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
    cell: (cell) => {
      const row = cell.row.original;
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
    cell: (cell) => {
      const tags = cell.getValue() as string[];
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
    cell: (cell) => {
      return (
        <AdminActionsCell
          entity={cell.row.original}
          editPath={`/admin/pages/experience/edit/`}
          entityLabel="experience"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
