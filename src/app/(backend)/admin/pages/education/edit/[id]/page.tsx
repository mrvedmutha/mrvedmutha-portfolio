"use client";
import EditEducationForm from "@/components/admin/pages/education/EditEducationForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { IEducation } from "@/types/admin/pages/education.types";

export default function EditEducationPage() {
  const { id } = useParams();
  const [education, setEducation] = useState<IEducation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducation() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/admin/education/${id}`);
        setEducation(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEducation();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            <Skeleton className="h-8 w-1/3" />
          </h1>
          <form className="space-y-6 max-w-lg mx-auto p-6">
            {/* Education Name */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Institute Name */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Education Type */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Description */}
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            {/* From/To Year */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
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
  if (!education)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Education not found
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Education</h1>
        <EditEducationForm education={education} />
      </div>
    </main>
  );
}
