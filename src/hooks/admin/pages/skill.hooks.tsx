import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ISkill } from "@/types/admin/pages/skill.types";
import axios from "axios";

export function useSkills() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/skills", {
          credentials: "include",
        });
        const data = await res.json();
        setSkills(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    handleDelete,
    router,
  };
}
