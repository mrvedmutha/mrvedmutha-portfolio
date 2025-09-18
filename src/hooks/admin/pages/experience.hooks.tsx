import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IExperience } from "@/types/admin/pages/experience.types";
import axios from "axios";

export function useExperiences() {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 15;
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
      setTotalItems((prev) => Math.max(0, prev - 1));
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

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/admin/experience?page=${page}&limit=${pageSize}`, {
          credentials: "include",
        });
        const data = await res.json();
        setExperiences(Array.isArray(data.data.data) ? data.data.data : []);
        setTotalItems(data.data.total || 0);
      } catch (err) {
        setExperiences([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, [page, pageSize]);

  return {
    experiences,
    loading,
    handleDelete,
    router,
    page,
    pageSize,
    totalItems,
    handlePageChange,
  };
}
