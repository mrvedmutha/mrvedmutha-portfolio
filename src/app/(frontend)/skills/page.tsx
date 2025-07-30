import SkillsSection from "@/components/home/skills/SkillsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills - Multi-Disciplinary Creative Expertise",
  description: "Discover my diverse skillset across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC. Learn about my tools, techniques, and creative approach in each discipline.",
  keywords: ["Creative Skills", "Web Development", "Graphic Design", "Video Editing", "Digital Marketing", "Amazon PPC", "Adobe Creative Suite", "React", "Next.js", "Content Creation", "Multi-disciplinary"],
  openGraph: {
    title: "Skills - Multi-Disciplinary Creative Expertise | Mrvedmutha",
    description: "Discover diverse skillset across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC.",
    type: "website",
    url: "/skills",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills - Multi-Disciplinary Creative Expertise | Mrvedmutha",
    description: "Discover diverse skillset across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC.",
  },
  alternates: {
    canonical: "/skills",
  },
};

export default function SkillsPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <SkillsSection showAll />
    </main>
  );
}
