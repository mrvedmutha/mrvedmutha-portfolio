import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ISkill } from "@/types/admin/pages/skill.types";
import axios from "axios";

export function useSkills() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 15;
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/skills/${id}`, {
        withCredentials: true,
      });
      setSkills((prev) =>
        Array.isArray(prev) ? prev.filter((s) => s._id !== id) : []
      );
      setTotalItems((prev) => Math.max(0, prev - 1));
      toast({
        title: "Skill deleted",
        description: "The skill was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the skill.",
        variant: "destructive",
      });
    }
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/admin/skills?page=${page}&limit=${pageSize}`, {
          credentials: "include",
        });
        const data = await res.json();
        setSkills(Array.isArray(data.data.data) ? data.data.data : []);
        setTotalItems(data.data.total || 0);
      } catch (err) {
        setSkills([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, [page, pageSize]);

  return {
    skills,
    loading,
    handleDelete,
    router,
    page,
    pageSize,
    totalItems,
    handlePageChange,
  };
}
