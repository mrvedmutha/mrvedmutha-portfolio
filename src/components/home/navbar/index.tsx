"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Menu, X, Search } from "lucide-react";
import { NavigationLinks } from "@/context/constants/home/navigation";
import SearchBar from "@/components/home/search/SearchBar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getBlogs, Blog } from "@/context/constants/home/blogs";
import { IService } from "@/types/admin/pages/service.types";
import * as LucideIcons from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogResults, setBlogResults] = useState<Blog[]>([]);
  const [serviceResults, setServiceResults] = useState<IService[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [allServices, setAllServices] = useState<IService[]>([]);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const pathname = usePathname();

  // Fetch initial data for mobile search
  useEffect(() => {
    getBlogs().then(setAllBlogs);
    fetch('/api/v1/admin/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.data) {
          setAllServices(data.data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Debounced search for mobile
  useEffect(() => {
    if (!searchQuery.trim()) {
      setBlogResults([]);
      setServiceResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const query = searchQuery.trim().toLowerCase();

      const filteredBlogs = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(query)
      );
      setBlogResults(filteredBlogs);

      const filteredServices = allServices.filter((service) =>
        service.name.toLowerCase().includes(query)
      );
      setServiceResults(filteredServices);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allBlogs, allServices]);

  return (
    <nav className="w-full bg-brand-green border-b border-brand-green sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop Layout - Capsule Style */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo/mrvedmutha-logo-final.svg"
              alt="Mr.Vedmutha Logo"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Center Navigation */}
          <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-6 py-2 gap-8">
            {NavigationLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors text-sm relative ${
                    isActive
                      ? "text-brand-yellow"
                      : "text-white hover:text-brand-yellow"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-yellow rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Right Side - Search + Contact Button */}
          <div className="flex items-center gap-4">
            <div className="w-64">
              <SearchBar />
            </div>
            <Link href="/contact">
              <Button className="bg-brand-yellow text-brand-green hover:bg-brand-yellow/90 font-semibold rounded-full px-6 py-2 transition-colors">
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Layout - Keep Original Style */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo/mrvedmutha-logo-final.svg"
              alt="Mr.Vedmutha Logo"
              width={160}
              height={44}
              className="h-10 w-auto"
            />
          </Link>
          {/* Search Icon + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="w-6 h-6 text-brand-yellow" />
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Menu className="w-6 h-6 text-brand-yellow" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="p-0 w-full max-w-full sm:max-w-full"
              style={{ backgroundColor: '#4A6034' }}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
                <Link
                  href="/"
                  className="flex items-center hover:opacity-80 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/logo/mrvedmutha-logo-final.svg"
                    alt="Mr.Vedmutha Logo"
                    width={160}
                    height={44}
                    className="h-10 w-auto"
                  />
                </Link>
                <SheetClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-white/10 custom-close-btn"
                  >
                    <X className="w-6 h-6 text-brand-yellow custom-close" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex flex-col items-center justify-center gap-8 mt-8">
                {NavigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-semibold transition-colors relative ${
                        isActive
                          ? "text-brand-yellow"
                          : "text-white hover:text-brand-yellow"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-yellow rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-brand-yellow text-brand-green hover:bg-brand-yellow/90 font-semibold rounded-full px-6 py-2 transition-colors mt-4">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Search Dialog */}
      <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <Command className="rounded-lg border-0 shadow-none">
            <CommandInput
              placeholder="Search services and blogs..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[300px]">
              {searchQuery.trim() && serviceResults.length === 0 && blogResults.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {/* Services Results */}
              {serviceResults.length > 0 && (
                <CommandGroup heading="Services">
                  {serviceResults.map((service) => {
                    const IconComponent = LucideIcons[service.icon.lucideName as keyof typeof LucideIcons] as React.ComponentType<any>;
                    return (
                      <CommandItem
                        key={service._id}
                        onSelect={() => {
                          setSelectedService(service);
                          setServiceModalOpen(true);
                          setMobileSearchOpen(false);
                        }}
                        className="flex items-center gap-3 p-3"
                      >
                        {IconComponent && (
                          <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{service.name}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {service.description.slice(0, 60)}...
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {/* Blogs Results */}
              {blogResults.length > 0 && (
                <CommandGroup heading="Blogs">
                  {blogResults.map((blog) => (
                    <CommandItem
                      key={blog._id}
                      onSelect={() => {
                        setMobileSearchOpen(false);
                        window.location.href = `/blog/${blog.slug}`;
                      }}
                      className="flex items-center gap-3 p-3"
                    >
                      {blog.mainImage && (
                        <img
                          src={blog.mainImage}
                          alt={blog.title}
                          className="w-10 h-10 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <span className="truncate font-medium">{blog.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

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
    </nav>
  );
}
