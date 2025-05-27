"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useExperiences } from "@/hooks/admin/pages/experience.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { IExperience } from "@/types/admin/pages/experience.types";
import getColumns from "@/helpers/admin/pages/experience.helpers";

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
        <div className="py-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<IExperience>
          columns={getColumns(router, handleDelete)}
          data={experiences}
          model="experience"
        />
      )}
    </div>
  );
}
