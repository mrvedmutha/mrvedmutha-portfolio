"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { IExperience } from "@/types/admin/pages/experience.types";
import getColumns from "@/helpers/admin/pages/experience.helpers";

const MOCK_DATA: IExperience[] = [
  {
    _id: "1",
    jobTitle: "Frontend Developer",
    companyName: "Tech Solutions",
    fromDate: "2021-01-01",
    toDate: "2023-06-01",
    currentlyWorking: false,
    tags: ["React", "TypeScript", "UI"],
  },
  {
    _id: "2",
    jobTitle: "Full Stack Engineer",
    companyName: "InnovateX",
    fromDate: "2023-07-01",
    toDate: undefined,
    currentlyWorking: true,
    tags: ["Node.js", "React", "AI"],
  },
];

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setExperiences(MOCK_DATA);
      setLoading(false);
    }, 1000);
  }, []);

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
          columns={getColumns(router)}
          data={experiences}
          model="experience"
        />
      )}
    </div>
  );
}
