import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: "Mrvedmutha - Creative Professional | Personal Experiences & Digital Expertise",
    template: "%s | Mrvedmutha"
  },
  description: "Sharing personal experiences and expertise in Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC. Discover my creative journey and professional insights.",
  keywords: ["Web Development", "Graphic Design", "Video Editing", "Digital Marketing", "Amazon PPC", "Personal Blog", "Creative Professional", "React", "Next.js", "Adobe Creative Suite", "Digital Creator"],
  authors: [{ name: "Mrvedmutha" }],
  creator: "Mrvedmutha",
  publisher: "Mrvedmutha",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Mrvedmutha',
    title: 'Mrvedmutha - Creative Professional | Personal Experiences & Digital Expertise',
    description: 'Sharing personal experiences and expertise across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mrvedmutha - Creative Professional | Personal Experiences & Digital Expertise',
    description: 'Sharing personal experiences and expertise across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC.',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
