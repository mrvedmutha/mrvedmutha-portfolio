import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/admin/blogs/blog.types";
import AdminActionsCell from "@/components/common/admin/pages/ActionsCell";
import Image from "next/image";

const getColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete?: (id: string) => void
): ColumnDef<Blog>[] => [
  {
    accessorKey: "mainImage",
    header: "Image",
    cell: (cell) => {
      const src = cell.getValue() as string;
      return src ? (
        <Image
          src={src}
          alt="Blog"
          width={192}
          height={108}
          className="rounded object-cover"
        />
      ) : null;
    },
  },
  {
    accessorKey: "title",
    header: "Post Title",
    cell: (cell) => cell.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (cell) => {
      const status = cell.getValue() as string;
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
    },
  },
  {
    accessorKey: "scheduledAt",
    header: "Scheduled For",
    cell: (cell) => {
      const row = cell.row.original;
      if (row.status !== "scheduled") return "-";
      const value = cell.getValue();
      return value ? new Date(value as string).toLocaleString() : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (cell) =>
      cell.getValue()
        ? new Date(cell.getValue() as string).toLocaleString()
        : "-",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: (cell) =>
      cell.getValue()
        ? new Date(cell.getValue() as string).toLocaleString()
        : "-",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (cell) => {
      return (
        <AdminActionsCell
          entity={cell.row.original}
          editPath={`/admin/blogs/edit/`}
          entityLabel="blog"
          router={router}
          onDelete={onDelete}
        />
      );
    },
  },
];

export default getColumns;
