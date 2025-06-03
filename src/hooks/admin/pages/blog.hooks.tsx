import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Blog } from "@/types/admin/blogs/blog.types";
import axios from "axios";

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/v1/admin/blogs/${id}`, {
        withCredentials: true,
      });
      setBlogs((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      );
      toast({
        title: "Blog deleted",
        description: "The blog was deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting the blog.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/blogs", {
          credentials: "include",
        });
        const data = await res.json();
        setBlogs(
          Array.isArray(data.data.data) ? data.data.data : data.data || []
        );
      } catch (err) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    handleDelete,
    router,
  };
}
