"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { NavigationLinks } from "@/context/constants/home/navigation";
import SearchBar from "@/components/home/search/SearchBar";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
            {NavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-medium hover:text-brand-yellow transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right Side - Search + Contact Button */}
          <div className="flex items-center gap-4">
            <div className="w-64">
              <SearchBar />
            </div>
            <Button 
              className="btn-primary"
              style={{ backgroundColor: '#FBB03B', color: '#FFFFFF' }}
            >
              Contact Me
            </Button>
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
          {/* Mobile Hamburger */}
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
              <div className="px-4 py-3 border-b border-white/20">
                <Input 
                  placeholder="Search..." 
                  className="rounded-full w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-brand-yellow" 
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-8 mt-8">
                {NavigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-semibold text-white hover:text-brand-yellow transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button 
                  className="btn-primary mt-4"
                  style={{ backgroundColor: '#FBB03B', color: '#FFFFFF' }}
                >
                  Contact Me
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
