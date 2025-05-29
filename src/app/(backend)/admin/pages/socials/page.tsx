"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
import getColumns from "@/helpers/admin/pages/social.helpers";
import { useSocials } from "@/hooks/admin/pages/social.hooks";
import { ISocial } from "@/types/admin/pages/social.types";

export default function AdminSocialsPage() {
  const { socials, loading, handleDelete, router } = useSocials();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Socials</h1>
        <Button onClick={() => router.push("/admin/pages/socials/new")}>
          Create Social
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={4} rowsCount={3} />
          </TableBody>
        </Table>
      ) : socials.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<ISocial>
          columns={getColumns(router, handleDelete)}
          data={socials}
          model="social"
          page={1}
          pageSize={25}
          total={socials.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
