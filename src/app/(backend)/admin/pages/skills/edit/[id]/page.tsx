"use client";
import EditSkillForm from "@/components/admin/skills/EditSkillForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSkillPage() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSkill() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/admin/skills/${id}`);
        setSkill(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchSkill();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            <Skeleton className="h-8 w-1/3" />
          </h1>
          <form className="space-y-6 max-w-lg mx-auto p-6">
            {/* Skill Title */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Icon Picker */}
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Tools/Tags Picker */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Submit Button */}
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </form>
        </div>
      </main>
    );
  if (error)
    return <div className="text-center py-8 text-destructive">{error}</div>;
  if (!skill)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Skill not found
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Skill</h1>
        <EditSkillForm skill={skill} />
      </div>
    </main>
  );
}
