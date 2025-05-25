"use client";
import React from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SessionProvider>
        <AdminSidebar />
        <main className="flex-1 w-full bg-background">{children}</main>
        <Toaster />
      </SessionProvider>
    </div>
  );
}
