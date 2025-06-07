"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import Link from "next/link";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const showBlogs = blogs.slice(0, 6);
  const hasMore = blogs.length > 6;

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
          Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        Blog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {showBlogs.map((blog, idx) => (
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
            {/* Blog Title */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <h2 className="text-xl font-bold mb-4 line-clamp-2">
                {blog.title}
              </h2>
              <Link href={`/blog/${blog.slug}`}>
                <button className="mt-auto px-4 py-2 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
                  Read more
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Link href="/blogs">
            <button className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
              Show more...
            </button>
          </Link>
        </div>
      )}
    </motion.section>
  );
}
