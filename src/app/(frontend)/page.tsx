import {
  Hero,
  SkillsSection,
  ProjectsSection,
  BlogSection,
  SocialSection,
} from "@/components/home";
import EducationExperienceSection from "@/components/home/EducationExperienceSection";
import SkillsMarquee from "@/components/home/SkillsMarquee";
import TechStackMarquee from "@/components/home/TechStackMarquee";
import ServicesSection from "@/components/home/ServicesSection";
import ContactUsForm from "@/components/home/contactus/ContactUsForm";
import type { Metadata } from "next";
import { PersonStructuredData, WebsiteStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Home - Personal Experiences & Creative Journey",
  description: "Welcome to my personal space where I share experiences, insights, and expertise across Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC. Join me on my creative and professional journey.",
  keywords: ["Personal Blog", "Creative Journey", "Web Development", "Graphic Design", "Video Editing", "Digital Marketing", "Amazon PPC", "Personal Experiences", "Professional Insights", "Creative Professional"],
  openGraph: {
    title: "Mrvedmutha - Personal Experiences & Creative Journey",
    description: "Sharing personal experiences and creative insights across multiple digital disciplines.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mrvedmutha - Personal Experiences & Creative Journey",
    description: "Sharing personal experiences and creative insights across multiple digital disciplines.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  return (
    <>
      <PersonStructuredData
        name="Mrvedmutha"
        jobTitle="Creative Professional & Digital Expert"
        url={baseUrl}
        description="Creative professional sharing personal experiences and expertise in Web Development, Graphic Design, Video Editing, Digital Marketing, and Amazon PPC"
        skills={["Web Development", "React", "Next.js", "Graphic Design", "Adobe Creative Suite", "Video Editing", "Digital Marketing", "Amazon PPC", "SEO", "Content Creation", "UI/UX Design"]}
      />
      <WebsiteStructuredData
        name="Mrvedmutha - Personal Experiences & Creative Journey"
        url={baseUrl}
        description="Personal blog and portfolio showcasing creative journey, professional experiences, and expertise across multiple digital disciplines"
        author="Mrvedmutha"
      />
      <div className="min-h-screen w-full flex flex-col">
        <SkillsMarquee />
        <div className="flex flex-col items-center justify-center">
          <Hero />
          <TechStackMarquee />
          <ServicesSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationExperienceSection />
          <BlogSection />
          <SocialSection />
          <div className="w-full bg-brand-green py-16">
            <div className="max-w-7xl mx-auto px-6">
              <ContactUsForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
