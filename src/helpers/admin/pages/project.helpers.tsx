import { ColumnDef } from "@tanstack/react-table";
import { IProject } from "@/types/admin/pages/project.types";
import Image from "next/image";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";

const getColumns = (
  router: any,
  handleDelete: (id: string) => void
): ColumnDef<IProject>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (cell) => {
      const value = cell.getValue() as string;
      return value === "code" ? "Code" : "Graphic Design";
    },
  },
  {
    accessorKey: "demoLink",
    header: "Demo Link",
    cell: (cell) => {
      const value = cell.getValue() as string;
      return value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Demo
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "techstack",
    header: "Techstack",
    cell: (cell) => {
      const techstack = cell.getValue() as { name: string; svg: string }[];
      return (
        <div className="flex flex-wrap gap-1">
          {techstack.map((tool) => (
            <span
              key={tool.name}
              className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs"
            >
              <Image src={tool.svg} alt={tool.name} width={16} height={16} />
              {tool.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: (cell) => (
      <AdminActionsCell
        entity={cell.row.original}
        editPath="/admin/pages/projects/edit/"
        entityLabel="project"
        router={router}
        onDelete={handleDelete}
      />
    ),
  },
];

export default getColumns;
