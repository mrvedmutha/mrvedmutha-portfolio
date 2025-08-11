"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Blog = {
  _id: string;
  title: string;
  mainImage?: string;
  slug: string;
  status: string;
  createdAt: string;
};

type Props = {
  blogs: Blog[];
};

const BLOGS_PER_PAGE = 21;

export function BlogsClientComponent({ blogs }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs = blogs.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  if (blogs.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No blog posts found.</p>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}