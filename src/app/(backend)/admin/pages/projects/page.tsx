"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { IProject } from "@/types/admin/pages/project.types";
import getColumns from "@/helpers/admin/pages/project.helpers";
import { useProjects } from "@/hooks/admin/pages/project.hooks";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";

export default function AdminProjectsPage() {
  const { projects, loading, handleDelete, router, page, pageSize, totalItems, handlePageChange } = useProjects();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => router.push("/admin/pages/projects/new")}>
          Create Project
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={5} rowsCount={3} />
          </TableBody>
        </Table>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IProject>
          columns={getColumns(router, handleDelete)}
          data={projects}
          model="project"
          page={page}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
