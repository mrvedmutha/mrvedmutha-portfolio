import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IExperience } from "@/types/admin/pages/experience.types";
import axios from "axios";

export function useExperiences() {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/experience/${id}`, {
        withCredentials: true,
      });
      setExperiences((prev) =>
        Array.isArray(prev) ? prev.filter((e) => e._id !== id) : []
      );
      toast({
        title: "Experience deleted",
        description: "The experience was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the experience.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/admin/experience", {
          withCredentials: true,
        });
        setExperiences(res.data.data || []);
      } catch (err) {
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  return {
    experiences,
    loading,
    handleDelete,
    router,
  };
}
