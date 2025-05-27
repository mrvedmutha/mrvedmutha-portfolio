"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useExperiences } from "@/hooks/admin/pages/experience.hooks";
import { IExperience } from "@/types/admin/pages/experience.types";
import getColumns from "@/helpers/admin/pages/experience.helpers";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";

export default function AdminExperiencePage() {
  const { experiences, loading, handleDelete, router } = useExperiences();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Button onClick={() => router.push("/admin/pages/experience/new")}>
          Create Experience
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={6} rowsCount={3} />
          </TableBody>
        </Table>
      ) : experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IExperience>
          columns={getColumns(router, handleDelete)}
          data={experiences}
          model="experience"
          fetchUrl="/api/v1/admin/experience"
          page={1}
          pageSize={25}
          total={experiences.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
