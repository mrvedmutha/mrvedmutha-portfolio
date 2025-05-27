"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ISkill } from "@/types/admin/pages/skill.types";
import getColumns from "@/helpers/admin/pages/skill.helpers";
import { useSkills } from "@/hooks/admin/pages/skill.hooks";
import { Table, TableBody } from "@/components/ui/table";
import { TableSkeletonRows } from "@/components/common/TableSkletonRows";
export default function AdminSkillsPage() {
  const { skills, loading, handleDelete, router } = useSkills();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button onClick={() => router.push("/admin/pages/skills/new")}>
          Create New Skill
        </Button>
      </div>
      {loading ? (
        <Table>
          <TableBody>
            <TableSkeletonRows columnsCount={3} rowsCount={3} />
          </TableBody>
        </Table>
      ) : skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<ISkill>
          columns={getColumns(router, handleDelete)}
          data={skills}
          model="skill"
          fetchUrl="/api/v1/admin/skills"
          page={1}
          pageSize={25}
          total={skills.length}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
}
