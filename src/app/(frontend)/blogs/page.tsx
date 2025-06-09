"use client";
import React, { useEffect, useState } from "react";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import { motion } from "framer-motion";
import Link from "next/link";

const BLOGS_PER_PAGE = 21;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs = blogs.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
            Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: BLOGS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
          Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paginatedBlogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.1 * idx,
              }}
              className="bg-muted rounded-xl shadow p-0 flex flex-col justify-start items-stretch border border-border min-h-[260px] overflow-hidden"
            >
              {/* Blog Image */}
              {blog.mainImage && (
                <img
                  src={blog.mainImage}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                />
              )}
              {/* Blog Title and Date */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <div className="text-sm text-muted-foreground mb-4">
                  Created on:{" "}
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <Link href={`/blog/${blog.slug}`}>
                  <button className="mt-auto px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
                    Read more
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              className="px-4 py-2 rounded bg-muted text-foreground font-semibold border border-border disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded bg-muted text-foreground font-semibold border border-border disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
