"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/home/ui/buttons";
import Link from "next/link";
import Image from "next/image";

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
        {paginatedBlogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-[#cecece] bg-[#f5f5f5] overflow-hidden">
              <CardContent className="p-0">
                {/* Blog Image */}
                <div className="relative w-full h-40 bg-gray-200">
                  {blog.mainImage ? (
                    <Image
                      src={blog.mainImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Blog Info */}
                <div className="p-6 space-y-4 flex flex-col h-full">
                  {/* Blog Title */}
                  <h3 className="text-xl font-bold text-black leading-tight line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Blog Date */}
                  <div className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2 mt-auto">
                    <LinkButton
                      onClick={() => window.location.href = `/blog/${blog.slug}`}
                      size="sm"
                    >
                      Read More
                    </LinkButton>
                  </div>
                </div>
              </CardContent>
            </Card>
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