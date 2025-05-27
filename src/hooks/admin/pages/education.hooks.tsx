import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IEducation } from "@/types/admin/pages/education.types";
import axios from "axios";

export function useEducations() {
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/education/${id}`, {
        withCredentials: true,
      });
      setEducations((prev) => prev.filter((e) => e._id !== id));
      toast({
        title: "Education deleted",
        description: "The education record was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the education record.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchEducations() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/education", {
          credentials: "include",
        });
        const data = await res.json();
        setEducations(data.data || []);
      } catch (err) {
        setEducations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEducations();
  }, []);

  return {
    educations,
    loading,
    handleDelete,
    router,
  };
}
