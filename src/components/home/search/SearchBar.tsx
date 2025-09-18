"use client";
import React, { useState, useEffect, useRef } from "react";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { IService } from "@/types/admin/pages/service.types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [blogResults, setBlogResults] = useState<Blog[]>([]);
  const [serviceResults, setServiceResults] = useState<IService[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [allServices, setAllServices] = useState<IService[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBlogs().then(setAllBlogs);
    // Fetch services
    fetch('/api/v1/admin/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.data) {
          setAllServices(data.data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setBlogResults([]);
      setServiceResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const searchQuery = query.trim().toLowerCase();

      // Filter blogs
      const filteredBlogs = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery)
      );
      setBlogResults(filteredBlogs);

      // Filter services
      const filteredServices = allServices.filter((service) =>
        service.name.toLowerCase().includes(searchQuery)
      );
      setServiceResults(filteredServices);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [query, allBlogs, allServices]);

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
      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50">
          {serviceResults.length === 0 && blogResults.length === 0 ? (
            <div className="p-4 text-muted-foreground text-center text-sm">
              No results found.
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {/* Services Section */}
              {serviceResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50">
                    Services
                  </div>
                  <div className="divide-y">
                    {serviceResults.map((service) => {
                      const IconComponent = LucideIcons[service.icon.lucideName as keyof typeof LucideIcons] as React.ComponentType<any>;
                      return (
                        <button
                          key={service._id}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition text-left"
                          onClick={() => {
                            setSelectedService(service);
                            setServiceModalOpen(true);
                            setOpen(false);
                          }}
                        >
                          {IconComponent && (
                            <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{service.name}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {service.description.slice(0, 80)}...
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Blogs Section */}
              {blogResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50">
                    Blogs
                  </div>
                  <div className="divide-y">
                    {blogResults.map((blog) => (
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
                            className="w-10 h-10 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <span className="truncate font-medium">{blog.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Service Modal */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedService && (() => {
                const IconComponent = LucideIcons[selectedService.icon.lucideName as keyof typeof LucideIcons] as React.ComponentType<any>;
                return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : null;
              })()}
              {selectedService?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {selectedService?.description}
            </p>
            {selectedService?.tags && selectedService.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-sm rounded-md"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
