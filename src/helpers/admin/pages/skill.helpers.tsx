import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ISkill } from "@/types/admin/pages/skill.types";
import Image from "next/image";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<ISkill>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (cell) => {
      const tags = cell.getValue() as ISkill["tags"];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag) => (
            <span
              key={tag.name}
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
            >
              <Image src={tag.svg} alt={tag.name} width={16} height={16} />
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
          editPath={`/admin/pages/skills/edit/`}
          entityLabel="skill"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
