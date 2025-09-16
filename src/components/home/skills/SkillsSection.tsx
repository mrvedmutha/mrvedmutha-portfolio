"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills } from "@/context/constants/home/skills";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton } from "@/components/home/ui/buttons";
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
      // Homepage skeleton - grid layout matching new design
      return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Skeleton className="w-8 h-0.5" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-12 w-80 mx-auto mb-2" />
              <Skeleton className="h-8 w-60 mx-auto" />
            </div>

            {/* Tech Stack Grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16 lg:mb-20 px-4 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 lg:p-5 bg-[#f5f5f5] border border-[#cecece] rounded-2xl min-h-[120px] md:min-h-[140px] lg:min-h-[160px]">
                  <Skeleton className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mb-3" />
                  <Skeleton className="h-3 w-16 md:w-20" />
                </div>
              ))}
            </div>

            {/* Button skeleton */}
            <div className="flex justify-center">
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>
      );
    }
  }


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
        <h2 className="text-4xl lg:text-5xl font-medium">
          <span className="text-brand-yellow italic">Exploring the tools</span>
        </h2>
        <h3 className="text-2xl lg:text-3xl font-medium text-black mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Behind my designs
        </h3>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16 lg:mb-20 px-4 max-w-6xl mx-auto">
        {(() => {
          // Get all tags from all skills and shuffle them randomly
          const allTags = skills.flatMap(skill => skill.tags || skill.tools || []);
          const shuffledTags = allTags.sort(() => Math.random() - 0.5);
          return shuffledTags.slice(0, 6).map((tool: any, index: number) => (
            <motion.div
              key={`${tool.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-4 lg:p-5 bg-[#f5f5f5] border border-[#cecece] rounded-2xl min-h-[120px] md:min-h-[140px] lg:min-h-[160px]"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center mb-3">
                <img
                  src={tool.svg}
                  alt={tool.name}
                  width={28}
                  height={28}
                  className="md:w-8 md:h-8 lg:w-9 lg:h-9"
                />
              </div>
              <span className="text-xs md:text-xs lg:text-sm font-medium text-gray-700 text-center leading-tight px-2">
                {tool.name.length > 12 ? `${tool.name.substring(0, 12)}...` : tool.name}
              </span>
            </motion.div>
          ));
        })()}
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
