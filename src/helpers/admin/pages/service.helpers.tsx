import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IService } from "@/types/admin/pages/service.types";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";
import * as LucideIcons from "lucide-react";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<IService>[] => [
  {
    accessorKey: "name",
    header: "Service Name",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: (cell) => {
      const icon = cell.getValue() as IService["icon"];
      const IconComponent = (LucideIcons as any)[icon.lucideName];
      return (
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-5 h-5" />}
          <span className="text-sm text-muted-foreground">{icon.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (cell) => {
      const description = cell.getValue() as string;
      return (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (cell) => {
      const tags = cell.getValue() as IService["tags"];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag, index) => (
            <span
              key={`${tag.name}-${index}`}
              className="bg-muted px-2 py-1 rounded text-xs"
            >
              {tag.name}
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
          editPath={`/admin/pages/services/edit/`}
          entityLabel="service"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;