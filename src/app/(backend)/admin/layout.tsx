"use client";
import React from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import { SessionProvider } from "next-auth/react";

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
      </SessionProvider>
    </div>
  );
}
