"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills, Skill } from "@/context/constants/home/skills";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Code,
  Database,
  Paintbrush,
  PenTool,
  Zap,
  Check,
  Circle,
} from "lucide-react";
import Link from "next/link";

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills().then((data) => {
      setSkills(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(showAll ? skills : skills.slice(0, 6)).map(
          (skill: Skill, idx: number) => {
            const LucideIcon = lucideIconMap[skill.icon] || Circle;
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
                className="bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-center border border-border min-h-[180px]"
              >
                <div className="flex items-center gap-3 mb-2 justify-center">
                  {React.createElement(LucideIcon, { size: 30 })}
                  <span className="text-xl font-bold">{skill.title}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {skill.tools.map((tool) => (
                    <span
                      key={tool.name as string}
                      className="flex items-center gap-1 bg-background px-2 py-1 rounded text-xs border border-border"
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
          }
        )}
      </div>
      {!showAll && (
        <div className="flex justify-center mt-8">
          <Link href="/skills">
            <button className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
              Show more...
            </button>
          </Link>
        </div>
      )}
    </motion.section>
  );
}
