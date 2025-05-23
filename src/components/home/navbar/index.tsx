"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import { NavigationLinks } from "@/context/constants/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="w-full bg-background/80 backdrop-blur border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="font-bold text-xl tracking-tight select-none">
          Mr.Vedmutha
        </div>
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 min-w-0 justify-center">
          <Input
            placeholder="Search..."
            className="rounded-full w-full min-w-0"
          />
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NavigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            aria-label="Toggle dark mode"
            variant="ghost"
            size="icon"
            className="ml-4 p-1 w-12 h-8 flex items-center border border-border rounded-full bg-background relative overflow-hidden justify-end"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ minWidth: 48, minHeight: 32 }}
          >
            <span className="sr-only">Toggle dark mode</span>
            {mounted && (
              <>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                    theme === "dark" ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <Sun className="w-6 h-6 text-black dark:text-white" />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                    theme === "light" ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <Moon className="w-6 h-6 text-black dark:text-white" />
                </span>
              </>
            )}
          </Button>
        </div>
        {/* Mobile Hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <SheetTrigger>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-0 w-full max-w-full sm:max-w-full"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="font-bold text-xl">Mr.Vedmutha</div>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <Input placeholder="Search..." className="rounded-full w-full" />
            </div>
            <div className="flex flex-col items-center justify-center gap-8 mt-8">
              {NavigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-8 w-full flex justify-center">
                <div className="flex items-center justify-between gap-2 w-1/2 max-w-xs mx-auto border border-border rounded-full bg-muted px-3 py-1">
                  <span className="text-base font-medium flex-1">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </span>
                  <Button
                    aria-label="Toggle dark mode"
                    variant="ghost"
                    size="icon"
                    className="p-1 w-12 h-8 flex items-center border border-border rounded-full bg-background relative overflow-hidden justify-end"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    style={{ minWidth: 48, minHeight: 32 }}
                  >
                    <span className="sr-only">Toggle dark mode</span>
                    {mounted && (
                      <>
                        <span
                          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                            theme === "dark"
                              ? "translate-x-0"
                              : "translate-x-full"
                          }`}
                        >
                          <Sun className="w-6 h-6 text-black dark:text-white" />
                        </span>
                        <span
                          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                            theme === "light"
                              ? "translate-x-0"
                              : "-translate-x-full"
                          }`}
                        >
                          <Moon className="w-6 h-6 text-black dark:text-white" />
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
