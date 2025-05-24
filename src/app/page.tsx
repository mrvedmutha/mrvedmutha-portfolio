import { Hero, AboutMe } from "@/components/home";
import AboutDevCardSection from "@/components/home/about/AboutDevCardSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Hero />
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        About Me
      </h2>
      <AboutMe />
      <AboutDevCardSection />
    </div>
  );
}
