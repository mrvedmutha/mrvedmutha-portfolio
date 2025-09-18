"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IService } from "@/types/admin/pages/service.types";
import getColumns from "@/helpers/admin/pages/service.helpers";
import { useServices } from "@/hooks/admin/pages/service.hooks";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
export default function AdminServicesPage() {
  const { services, loading, handleDelete, router, page, pageSize, totalItems, handlePageChange } = useServices();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => router.push("/admin/pages/services/new")}>
          Create New Service
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={5} rowsCount={3} />
          </TableBody>
        </Table>
      ) : (
        <DataTable<IService>
          columns={getColumns(router, handleDelete)}
          data={services}
          model="service"
          page={page}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}