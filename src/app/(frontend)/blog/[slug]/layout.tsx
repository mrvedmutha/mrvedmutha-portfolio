import type { Metadata } from "next";
import { Blog as BlogBase } from "@/context/constants/home/blogs";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";

// Extend Blog type for post page
type BlogType = BlogBase & {
  description?: string;
  author?: string;
  allowComments?: boolean;
};

function isAuthorObject(
  author: unknown
): author is { name?: string; avatarUrl?: string } {
  return (
    typeof author === "object" &&
    author !== null &&
    ("name" in author || "avatarUrl" in author)
  );
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const apiUrl = process.env.NEXTAUTH_URL || "";
  const res = await fetch(`${apiUrl}/api/v1/admin/blogs?slug=${params.slug}`, {
    cache: "no-store",
  });
  const data = await res.json();
  const blog: BlogType | null = data?.data || null;

  if (!blog || blog.status !== BlogStatus.PUBLISHED) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const authorName =
    blog.author && isAuthorObject(blog.author) ? blog.author.name : undefined;
  const description = blog.description
    ? blog.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : "";

  // Title: Blog Title - Author Name (if available)
  const title = authorName ? `${blog.title} - ${authorName}` : blog.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.createdAt,
      authors: authorName ? [authorName] : undefined,
      images: blog.mainImage ? [blog.mainImage] : undefined,
      url: `${apiUrl}/blog/${blog.slug}`,
    },
    twitter: {
      card: blog.mainImage ? "summary_large_image" : "summary",
      title,
      description,
      images: blog.mainImage ? [blog.mainImage] : undefined,
    },
    alternates: {
      canonical: `${apiUrl}/blog/${blog.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  // You can use slug if needed
  return <>{children}</>;
}
