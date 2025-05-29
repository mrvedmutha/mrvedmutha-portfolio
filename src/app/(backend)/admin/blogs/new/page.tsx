import NewBlogsForm from "@/components/admin/pages/blogs/NewBlogsForm";

export default function NewBlogPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left 80% */}
      <div className="w-4/5 p-8 border-r">
        <NewBlogsForm />
      </div>
      {/* Right 20% */}
      <div className="w-1/5 p-8"></div>
    </div>
  );
}
