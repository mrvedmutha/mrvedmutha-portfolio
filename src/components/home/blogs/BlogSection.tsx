"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton, LinkButton } from "@/components/home/ui/buttons";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import Link from "next/link";
import Image from "next/image";

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
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-8 h-0.5" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-12 w-80" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full border border-[#cecece] bg-[#f5f5f5]">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-40 rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-brand-yellow"></div>
            <span className="text-gray-600 font-medium">Sharing My Thoughts</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-black">Latest </span>
            <span className="text-brand-yellow italic">Blogs</span>
          </h2>
        </div>

        <PrimaryButton size="lg" onClick={() => window.location.href = "/blogs"}>
          Show More
        </PrimaryButton>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {showBlogs.map((blog, index) => (
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

      {/* No Blogs State */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
        </div>
      )}
    </section>
  );
}
