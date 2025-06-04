"use client";
import EditBlogForm from "@/components/admin/pages/blogs/EditBlogForm";
import { useParams } from "next/navigation";

export default function EditBlogPage() {
  const { id } = useParams();
  return <EditBlogForm blogId={id as string} />;
}
