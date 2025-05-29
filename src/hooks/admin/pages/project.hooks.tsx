import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IProject } from "@/types/admin/pages/project.types";
import axios from "axios";

export function useProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/projects/${id}`, {
        withCredentials: true,
      });
      setProjects((prev) =>
        Array.isArray(prev) ? prev.filter((p) => p._id !== id) : []
      );
      toast({
        title: "Project deleted",
        description: "The project was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the project.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/projects", {
          credentials: "include",
        });
        const data = await res.json();
        setProjects(Array.isArray(data.data.data) ? data.data.data : []);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    handleDelete,
    router,
  };
}
