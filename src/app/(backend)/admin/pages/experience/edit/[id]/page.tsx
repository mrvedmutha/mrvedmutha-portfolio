"use client";
import EditExperienceForm from "@/components/admin/pages/experience/EditExperienceForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExperiencePage() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExperience() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/admin/experience/${id}`);
        setExperience(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchExperience();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            <Skeleton className="h-8 w-1/3" />
          </h1>
          <form className="space-y-6 max-w-lg mx-auto p-6">
            {/* Job Title */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Company Name */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* About Company */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            {/* From Date */}
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* To Date */}
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Currently Working */}
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            {/* Responsibilities */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            {/* Tags */}
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
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
  if (!experience)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Experience not found
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Experience</h1>
        <EditExperienceForm experience={experience} />
      </div>
    </main>
  );
}
