import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education - Learning Journey & Growth",
  description: "Discover my educational journey, certifications, and continuous learning across Web Development, Design, Marketing, and creative disciplines. Learn about my personal growth and skill development story.",
  keywords: ["Education", "Learning Journey", "Certifications", "Skill Development", "Creative Education", "Digital Marketing Courses", "Design Training", "Personal Growth", "Continuous Learning"],
  openGraph: {
    title: "Education - Learning Journey & Growth | Mrvedmutha",
    description: "Discover educational journey and continuous learning across multiple creative disciplines.",
    type: "website",
    url: "/education",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education - Learning Journey & Growth | Mrvedmutha",
    description: "Discover educational journey and continuous learning across multiple creative disciplines.",
  },
  alternates: {
    canonical: "/education",
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}