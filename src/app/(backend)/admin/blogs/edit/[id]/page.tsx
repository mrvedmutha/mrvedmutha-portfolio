"use client";
import EditBlogForm from "@/components/admin/pages/blogs/EditBlogForm";
import { useParams } from "next/navigation";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const { id } = useParams();
  return <EditBlogForm blogId={params.id} />;
}
