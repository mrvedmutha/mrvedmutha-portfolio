"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IBlog {
  _id: string;
  image: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const mockBlogs: IBlog[] = [
  {
    _id: "1",
    image: "/placeholder.png",
    title: "How to Build a Portfolio Website",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-02T12:00:00Z",
  },
  {
    _id: "2",
    image: "/placeholder.png",
    title: "10 Tips for Learning React",
    createdAt: "2024-05-20T09:00:00Z",
    updatedAt: "2024-05-21T11:00:00Z",
  },
];

function getColumns(
  router: ReturnType<typeof useRouter>,
  onDelete: (id: string) => void
) {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: (cell: any) => (
        <Image
          src={cell.getValue()}
          alt="Blog"
          width={48}
          height={48}
          className="rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Post Title",
      cell: (cell: any) => cell.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (cell: any) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: (cell: any) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (cell: any) => {
        const entity = cell.row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/blogs/edit/${entity._id}`)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(entity._id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<IBlog[]>(mockBlogs);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={() => router.push("/admin/blogs/new")}>
          Create Blog
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={5} rowsCount={3} />
          </TableBody>
        </Table>
      ) : blogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IBlog>
          columns={getColumns(router, handleDelete)}
          data={blogs}
          model="blog"
          page={1}
          pageSize={25}
          total={blogs.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
