"use client";
import EditProjectForm from "@/components/admin/pages/projects/EditProjectForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/admin/projects/edit/${id}`);
        setProject(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProject();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            <Skeleton className="h-8 w-1/3" />
          </h1>
          <form className="space-y-6 max-w-lg mx-auto p-6">
            {/* Project Title */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Project Description */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            {/* Project Type */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Github/Behance Link */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Demo Link */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Techstack */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
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
  if (!project)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Project not found
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
        <EditProjectForm project={project} />
      </div>
    </main>
  );
}
