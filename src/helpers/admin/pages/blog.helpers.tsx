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
      console.log("getColumns src:", src);
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
