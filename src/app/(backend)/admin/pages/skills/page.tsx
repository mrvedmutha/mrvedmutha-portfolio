"use client";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ISkill } from "@/types/admin/pages/skill.types";
import getColumns from "@/helpers/admin/pages/skill.helpers";
import axios from "axios";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/skills/${id}`, {
        withCredentials: true,
      });
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      // Optionally show error toast
    }
  }

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/skills", {
          credentials: "include",
        });
        const data = await res.json();
        setSkills(data.data || []);
      } catch (err) {
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button onClick={() => router.push("/admin/pages/skills/new")}>
          Create New Skill
        </Button>
      </div>
      {loading ? (
        <div className="py-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      ) : (
        <DataTable<ISkill>
          columns={getColumns(router, handleDelete)}
          data={skills}
          model="skill"
        />
      )}
    </div>
  );
}
