import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ISocial } from "@/types/admin/pages/social.types";
import axios from "axios";

export function useSocials() {
  const [socials, setSocials] = useState<ISocial[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/socials/${id}`, {
        withCredentials: true,
      });
      setSocials((prev) =>
        Array.isArray(prev) ? prev.filter((s) => s._id !== id) : []
      );
      toast({
        title: "Social deleted",
        description: "The social was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the social.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchSocials() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/socials", {
          credentials: "include",
        });
        const data = await res.json();
        setSocials(Array.isArray(data.data.data) ? data.data.data : []);
      } catch (err) {
        setSocials([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSocials();
  }, []);

  return {
    socials,
    loading,
    handleDelete,
    router,
  };
}
