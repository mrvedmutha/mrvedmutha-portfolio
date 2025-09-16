"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBlogs().then(setAllBlogs);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = allBlogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    setResults(filtered);
  }, [query, allBlogs]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder="Search..."
        className="rounded-full w-full min-w-0 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-brand-yellow"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50">
          {results.length === 0 && query.trim() ? (
            <div className="p-4 text-muted-foreground text-center text-sm">
              No blogs found.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y">
              {results.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition"
                  onClick={() => setOpen(false)}
                >
                  {blog.mainImage && (
                    <img
                      src={blog.mainImage}
                      alt={blog.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <span className="truncate font-medium">{blog.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
