import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IService } from "@/types/admin/pages/service.types";
import axios from "axios";

export function useServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/services/${id}`, {
        withCredentials: true,
      });
      setServices((prev) =>
        Array.isArray(prev) ? prev.filter((s) => s._id !== id) : []
      );
      toast({
        title: "Service deleted",
        description: "The service was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the service.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/services", {
          credentials: "include",
        });
        const data = await res.json();
        setServices(Array.isArray(data.data.data) ? data.data.data : []);
      } catch (err) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return {
    services,
    loading,
    handleDelete,
    router,
  };
}