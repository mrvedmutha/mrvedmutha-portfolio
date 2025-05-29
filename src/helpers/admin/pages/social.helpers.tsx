import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ISocial } from "@/types/admin/pages/social.types";
import { SocialIcon } from "react-social-icons";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<ISocial>[] => [
  {
    accessorKey: "name",
    header: "Social Name",
    cell: (cell) => {
      const row = cell.row.original as ISocial;
      return (
        <span className="flex items-center gap-2">
          <SocialIcon network={row.network} style={{ height: 24, width: 24 }} />
          {row.name}
        </span>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: (cell) => {
      const value = cell.getValue() as string;
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {value}
        </a>
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
          editPath="/admin/pages/socials/edit/"
          entityLabel="social"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
