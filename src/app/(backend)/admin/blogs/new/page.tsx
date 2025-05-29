import NewBlogsForm from "@/components/admin/pages/blogs/NewBlogsForm";
import BlogPostSidebar from "@/components/admin/pages/blogs/BlogPostSidebar";

export default function NewBlogPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left 75% */}
      <div className="w-3/4 min-w-0 p-8 border-r">
        <NewBlogsForm />
      </div>
      {/* Right 25% */}
      <div className="w-1/4 min-w-0 p-8">
        <BlogPostSidebar />
      </div>
    </div>
  );
}
