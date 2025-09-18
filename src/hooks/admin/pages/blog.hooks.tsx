import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Blog } from "@/types/admin/blogs/blog.types";
import axios from "axios";

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 15;
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
      setTotalItems((prev) => Math.max(0, prev - 1));
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

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/admin/blogs?page=${page}&limit=${pageSize}`, {
          credentials: "include",
        });
        const data = await res.json();
        setBlogs(
          Array.isArray(data.data.data) ? data.data.data : data.data || []
        );
        setTotalItems(data.data.total || 0);
      } catch (err) {
        setBlogs([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [page, pageSize]);

  return {
    blogs,
    loading,
    handleDelete,
    router,
    page,
    pageSize,
    totalItems,
    handlePageChange,
  };
}
