import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - Creative & Professional Journey",
  description: "Explore my diverse professional journey across Web Development, Graphic Design, Video Production, Digital Marketing, and Amazon PPC. Learn about my roles, achievements, and personal growth in the creative industry.",
  keywords: ["Professional Experience", "Creative Journey", "Web Development Career", "Graphic Design Experience", "Video Production", "Digital Marketing", "Amazon PPC", "Creative Professional", "Multi-disciplinary Career"],
  openGraph: {
    title: "Experience - Creative & Professional Journey | Mrvedmutha",
    description: "Explore diverse professional journey across multiple creative and digital disciplines.",
    type: "website",
    url: "/experience",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience - Creative & Professional Journey | Mrvedmutha",
    description: "Explore diverse professional journey across multiple creative and digital disciplines.",
  },
  alternates: {
    canonical: "/experience",
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}