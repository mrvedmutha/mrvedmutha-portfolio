import React from "react";
import { BlogsClientComponent } from "@/components/blogs/BlogsClientComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Mrvedmutha | Web Development & Digital Marketing Insights",
  description: "Explore articles on web development, React, Next.js, Amazon PPC, and digital marketing. Get insights from a full-stack developer's journey.",
  openGraph: {
    title: "Blog - Mrvedmutha",
    description: "Explore articles on web development, React, Next.js, Amazon PPC, and digital marketing.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Blog = {
  _id: string;
  title: string;
  mainImage?: string;
  slug: string;
  status: string;
  createdAt: string;
};

// Server function to fetch blogs
async function getBlogs(): Promise<Blog[]> {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/v1/admin/blogs?status=published`, {
      cache: "no-store",
    });
    const data = await res.json();
    const blogs = data?.data || [];
    return blogs
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((blog: any) => ({
        _id: blog._id,
        title: blog.title,
        mainImage: blog.mainImage,
        slug: blog.slug,
        status: blog.status,
        createdAt: blog.createdAt,
      }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mt-16 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-brand-yellow"></div>
            <span className="text-gray-600 font-medium">Sharing My Thoughts</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-black">All </span>
            <span className="text-brand-yellow italic">Blogs</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights on web development, React, Next.js, Amazon PPC, and my journey as a full-stack developer.
          </p>
        </div>
        <BlogsClientComponent blogs={blogs} />
      </div>
    </main>
  );
}
