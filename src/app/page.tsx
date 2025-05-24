import {
  Hero,
  AboutMe,
  SkillsSection,
  ProjectsSection,
} from "@/components/home";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Hero />
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        About Me
      </h2>
      <AboutMe />
      <SkillsSection />
      <ProjectsSection />
    </div>
  );
}
