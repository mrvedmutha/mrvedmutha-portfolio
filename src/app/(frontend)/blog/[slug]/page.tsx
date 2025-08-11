import React from "react";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";
import { CommentProvider, CommentSection } from "@/components/comments";
import { notFound } from "next/navigation";

// Extend Blog type for post page
type BlogType = {
  _id: string;
  title: string;
  mainImage?: string;
  slug: string;
  status: string;
  createdAt: string;
  description?: string;
  author?: any;
  allowComments?: boolean;
  updatedAt?: string;
};

// Type guard for author object
function isAuthorObject(
  author: unknown
): author is { name?: string; avatarUrl?: string } {
  return (
    typeof author === "object" &&
    author !== null &&
    ("name" in author || "avatarUrl" in author)
  );
}

// Server function to fetch blog data
async function getBlogBySlug(slug: string): Promise<BlogType | null> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/v1/admin/blogs?slug=${slug}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  // If blog doesn't exist or is not published, show 404
  if (!blog || blog.status !== BlogStatus.PUBLISHED) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="w-full max-w-3xl mx-auto px-4 mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mt-16 mb-6 text-center w-full">
          {blog.title}
        </h1>
        {blog.mainImage && (
          <img
            src={blog.mainImage}
            alt={blog.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
        )}
        {/* Description/Post Content */}
        <div
          className="prose prose-lg max-w-none mb-8 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
        />
        {/* Author */}
        {blog?.author && isAuthorObject(blog.author) && (
          <div className="mb-6 text-muted-foreground text-sm flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
              {blog.author.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            By {blog.author.name}
          </div>
        )}
        {/* Updated At */}
        {blog?.updatedAt && (
          <div className="mb-6 text-xs text-muted-foreground">
            Last updated:{" "}
            {new Date(blog.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
        {/* Comments */}
        <div className="mt-12">
          <CommentProvider>
            <CommentSection 
              blogId={blog._id} 
              allowComments={blog?.allowComments !== false} 
            />
          </CommentProvider>
        </div>
      </div>
    </main>
  );
}
