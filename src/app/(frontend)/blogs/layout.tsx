import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs - Personal Experiences & Creative Insights",
  description: "Dive into my personal experiences and insights across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC. Real stories, practical tips, and lessons learned from my creative journey.",
  keywords: ["Personal Blog", "Creative Insights", "Web Development Stories", "Design Process", "Video Production Tips", "Digital Marketing Experience", "Amazon PPC Strategies", "Creative Journey", "Professional Insights", "Personal Growth"],
  openGraph: {
    title: "Blogs - Personal Experiences & Creative Insights | Mrvedmutha",
    description: "Personal experiences and insights across multiple creative disciplines and professional journey.",
    type: "website",
    url: "/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs - Personal Experiences & Creative Insights | Mrvedmutha",
    description: "Personal experiences and insights across multiple creative disciplines and professional journey.",
  },
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}