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
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

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
    </nav>
  );
}
