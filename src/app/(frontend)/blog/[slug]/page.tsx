"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Blog as BlogBase } from "@/context/constants/home/blogs";
import { BlogStatus } from "@/enums/admin/blogs/status.enum";

// Extend Blog type for post page
type BlogType = BlogBase & {
  description?: string;
  author?: string;
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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`/api/v1/admin/blogs?slug=${slug}`)
      .then((res) => {
        const found = res.data?.data || null;
        if (found?.status === BlogStatus.PRIVATE) {
          setShowPasswordDialog(true);
        }
        setBlog(found as BlogType);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your real password check API
    try {
      const res = await axios.post(`/api/v1/admin/blogs/check-password`, {
        slug,
        password,
      });
      if (res.data?.success) {
        setAuthorized(true);
        setShowPasswordDialog(false);
        setPasswordError("");
      } else {
        setPasswordError("Incorrect password");
      }
    } catch {
      setPasswordError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (
    !blog ||
    (blog.status !== BlogStatus.PUBLISHED &&
      !(blog.status === BlogStatus.PRIVATE && authorized))
  ) {
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">
          Blog not found or not accessible.
        </div>
      </main>
    );
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
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
        />
        {/* Author */}
        {blog?.author && isAuthorObject(blog.author) && (
          <div className="mb-6 text-muted-foreground text-sm flex items-center gap-2">
            {blog.author.avatarUrl && (
              <img
                src={blog.author.avatarUrl}
                alt={blog.author.name || "Author"}
                className="w-7 h-7 rounded-full object-cover"
              />
            )}
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
        {blog?.allowComments === false ? (
          <div className="text-center text-muted-foreground">
            Comments are disabled for this post.
          </div>
        ) : (
          <div className="mt-8">
            {/* Comments section placeholder */}
            <div className="text-center text-muted-foreground">
              Comments section coming soon...
            </div>
          </div>
        )}
      </div>
      {/* Private Blog Password Dialog */}
      {showPasswordDialog && !authorized && (
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>This blog is private</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-4 mt-4"
              >
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded px-3 py-2"
                  required
                />
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
                >
                  Submit
                </button>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
