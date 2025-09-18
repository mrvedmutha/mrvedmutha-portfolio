import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IEducation } from "@/types/admin/pages/education.types";
import axios from "axios";

export function useEducations() {
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 15;
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/education/${id}`, {
        withCredentials: true,
      });
      setEducations((prev) => {
        console.log(prev);
        console.log(id);
        return Array.isArray(prev) ? prev.filter((e) => e._id !== id) : [];
      });
      setTotalItems((prev) => Math.max(0, prev - 1));
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

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function fetchEducations() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/admin/education?page=${page}&limit=${pageSize}`, {
          credentials: "include",
        });
        const data = await res.json();
        setEducations(Array.isArray(data.data.data) ? data.data.data : []);
        setTotalItems(data.data.total || 0);
      } catch (err) {
        setEducations([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchEducations();
  }, [page, pageSize]);

  return {
    educations,
    loading,
    handleDelete,
    router,
    page,
    pageSize,
    totalItems,
    handlePageChange,
  };
}
