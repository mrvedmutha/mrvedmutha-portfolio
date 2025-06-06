import {
  Hero,
  AboutMe,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  BlogSection,
  SocialSection,
} from "@/components/home";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Hero />
      <AboutMe />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <BlogSection />
      <SocialSection />
    </div>
  );
}
