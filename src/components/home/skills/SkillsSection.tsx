"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills } from "@/context/constants/home/skills";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton } from "@/components/home/ui/buttons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Code,
  Database,
  Paintbrush,
  PenTool,
  Zap,
  Check,
  Circle,
} from "lucide-react";

const lucideIconMap: Record<string, React.ElementType> = {
  Code,
  Database,
  Paintbrush,
  PenTool,
  Zap,
  Check,
};

interface SkillsSectionProps {
  showAll?: boolean;
}

export default function SkillsSection({ showAll = false }: SkillsSectionProps) {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("https://mrvedmutha.com/api/v1/admin/skills");
        const data = await response.json();
        if (data.success && data.data?.data) {
          // Sort by creation date (latest first)
          const sortedSkills = data.data.data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          setSkills(sortedSkills);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        // Fallback to static data if API fails
        getSkills().then((data) => {
          setSkills(data);
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading) {
    // Different skeletons for homepage vs skills page
    if (showAll) {
      // Skills page skeleton - card based
      return (
        <div className="min-h-screen bg-background">
          <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Skeleton className="w-8 h-0.5" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="w-8 h-0.5" />
                </div>
                <Skeleton className="h-12 w-80 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#f5f5f5] border border-[#cecece] rounded-xl p-8 min-h-[200px]">
                    <div className="flex items-center gap-3 mb-4 justify-center">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex flex-wrap gap-2 justify-center">
                          <Skeleton className="h-6 w-16 rounded" />
                          <Skeleton className="h-6 w-20 rounded" />
                          <Skeleton className="h-6 w-14 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Homepage skeleton - carousel + capsules
      return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Skeleton className="w-8 h-0.5" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-12 w-80 mx-auto" />
            </div>
            <div className="text-center">
              <Skeleton className="h-16 w-96 mx-auto mb-8" />
            </div>
            <div className="flex justify-center gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-24 bg-[#f5f5f5] border border-[#cecece] rounded-full flex flex-col items-center justify-center p-4">
                  <Skeleton className="w-10 h-10 rounded-full mb-2" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>
      );
    }
  }

  const displaySkills = showAll ? skills : skills.slice(0, 5);

  // If showAll is true, render the full page layout
  if (showAll) {
    return (
      <div className="min-h-screen bg-background">
        <div className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-brand-yellow"></div>
              <span className="text-gray-600 font-medium">My Favorite Tools</span>
              <div className="w-8 h-0.5 bg-brand-yellow"></div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-brand-yellow italic">All Skills &</span>
              <span className="text-black"> Tools</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore my complete toolkit and expertise across various technologies and creative disciplines.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill: any, idx: number) => {
              const iconName = skill.icon?.lucideName || skill.icon || 'Circle';
              const LucideIcon = lucideIconMap[iconName] || Circle;
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: 0.1 * idx,
                  }}
                  className="bg-[#f5f5f5] border border-[#cecece] rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-4 justify-center">
                    {React.createElement(LucideIcon, {
                      size: 30,
                      className: "text-brand-green"
                    })}
                    <span className="text-xl font-bold">{skill.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {(skill.tags || skill.tools || []).map((tool: any) => (
                      <span
                        key={tool.name as string}
                        className="flex items-center gap-1 bg-white px-3 py-1.5 rounded text-sm border border-gray-200 hover:border-brand-green transition-colors duration-200"
                      >
                        <img
                          src={tool.svg}
                          alt={tool.name}
                          width={18}
                          height={18}
                        />
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* No Skills State */}
          {skills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No skills available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Homepage carousel layout
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-16 px-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-0.5 bg-brand-yellow"></div>
          <span className="text-gray-600 font-medium">My Favorite Tools</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold">
          <span className="text-brand-yellow italic">Exploring the tools</span>
        </h2>
      </div>

      {/* Skills Carousel */}
      <div className="mb-16 lg:mb-20">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
          setApi={(api) => {
            if (api) {
              api.on("select", () => {
                setCurrentSkillIndex(api.selectedScrollSnap());
              });
            }
          }}
        >
          <CarouselContent className="ml-0">
            {displaySkills.map((skill, index) => {
              const iconName = skill.icon?.lucideName || skill.icon || 'Circle';
              const LucideIcon = lucideIconMap[iconName] || Circle;
              return (
                <CarouselItem key={skill.title} className="pl-0 basis-full">
                  <div className="text-center py-8 lg:py-12 px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
                      <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold">
                        <LucideIcon className="text-brand-green w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex-shrink-0" />
                        <span className="text-black text-center leading-tight max-w-xs sm:max-w-md lg:max-w-2xl">{skill.title}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Tech Stack Capsules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-16 lg:mb-20 px-4 max-w-4xl mx-auto">
        {displaySkills.length > 0 && displaySkills[currentSkillIndex] && (displaySkills[currentSkillIndex].tags || displaySkills[currentSkillIndex].tools || []).slice(0, 4).map((tool: any, index: number) => (
          <motion.div
            key={`${currentSkillIndex}-${tool.name}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center p-3 sm:p-4 lg:p-6 bg-[#f5f5f5] border border-[#cecece] rounded-full min-w-[80px] sm:min-w-[90px] lg:min-w-[120px] max-w-[120px] mx-auto"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <img
                src={tool.svg}
                alt={tool.name}
                width={24}
                height={24}
                className="sm:w-7 sm:h-7 lg:w-8 lg:h-8"
              />
            </div>
            <span className="text-xs sm:text-xs lg:text-sm font-medium text-gray-700 text-center leading-tight px-1">
              {tool.name.length > 10 ? `${tool.name.substring(0, 10)}...` : tool.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Explore All Button */}
      <div className="flex justify-center">
        <PrimaryButton onClick={() => window.location.href = "/skills"}>
          EXPLORE ALL
        </PrimaryButton>
      </div>
    </motion.section>
  );
}
