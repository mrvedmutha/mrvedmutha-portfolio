import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Creative Portfolio & Personal Work",
  description: "Explore my diverse creative projects spanning Web Development, Graphic Design, Video Production, and Digital Marketing campaigns. Discover the stories behind each project and my creative process.",
  keywords: ["Creative Projects", "Web Development Projects", "Graphic Design Portfolio", "Video Editing Work", "Digital Marketing Campaigns", "Personal Projects", "Creative Process", "Design Thinking"],
  openGraph: {
    title: "Projects - Creative Portfolio & Personal Work | Mrvedmutha",
    description: "Explore diverse creative projects spanning multiple digital disciplines and personal experiences.",
    type: "website",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - Creative Portfolio & Personal Work | Mrvedmutha",
    description: "Explore diverse creative projects spanning multiple digital disciplines and personal experiences.",
  },
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}