import React from "react";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/Footer";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
