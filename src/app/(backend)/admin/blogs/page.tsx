"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBlogs } from "@/hooks/admin/pages/blog.hooks";
import getColumns from "@/helpers/admin/pages/blog.helpers";

export default function AdminBlogsPage() {
  const { blogs, loading, handleDelete, router } = useBlogs();

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
      ) : (
        <DataTable
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
