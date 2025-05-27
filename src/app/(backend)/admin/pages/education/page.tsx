"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useEducations } from "@/hooks/admin/pages/education.hooks";
import getColumns from "@/helpers/admin/pages/education.helpers";
import { IEducation } from "@/types/admin/pages/education.types";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
import { Table, TableBody } from "@/components/ui/table";

export default function AdminEducationPage() {
  const { educations, loading, handleDelete, router } = useEducations();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button onClick={() => router.push("/admin/pages/education/new")}>
          Create Education
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={7} rowsCount={3} />
          </TableBody>
        </Table>
      ) : educations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IEducation>
          columns={getColumns(router, handleDelete)}
          data={educations}
          model="education"
          fetchUrl="/api/v1/admin/education"
          page={1}
          pageSize={25}
          total={educations.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
