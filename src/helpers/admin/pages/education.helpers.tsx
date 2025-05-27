import { ColumnDef } from "@tanstack/react-table";
import { IEducation } from "@/types/admin/pages/education.types";
import { useRouter } from "next/navigation";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<IEducation>[] => [
  {
    accessorKey: "educationName",
    header: "Education Name",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "instituteName",
    header: "Institute Name",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "educationType",
    header: "Education Type",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "fromYear",
    header: "From Year",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "toYear",
    header: "To Year",
    cell: (cell) => cell.getValue(),
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
          editPath={`/admin/pages/education/edit/`}
          entityLabel="education"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
