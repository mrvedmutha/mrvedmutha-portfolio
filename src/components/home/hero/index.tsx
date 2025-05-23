"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSkills } from "@/context/constants/hero";
import type { HeroSkill } from "@/types/home/hero";
import TechStackGrid from "./TechStackGrid";

const skills: HeroSkill[] = HeroSkills;

export default function Hero() {
  const [skillIndex, setSkillIndex] = React.useState(0);
  const [showSkill, setShowSkill] = React.useState("");
  const [typing, setTyping] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);

  // Typing and erasing effect for skills
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentSkill = skills[skillIndex];
    if (typing) {
      if (showSkill.length < currentSkill.length) {
        timeout = setTimeout(() => {
          setShowSkill(currentSkill.slice(0, showSkill.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (showSkill.length > 0) {
        timeout = setTimeout(() => {
          setShowSkill(currentSkill.slice(0, showSkill.length - 1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setTyping(true);
          setSkillIndex((prev) => (prev + 1) % skills.length);
        }, 300);
      }
    }
    return () => clearTimeout(timeout);
  }, [showSkill, typing, skillIndex, skills]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[60vh]">
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-start justify-center gap-8">
        <div className="relative select-none">
          <div className="flex items-center gap-2 text-3xl md:text-5xl font-bold">
            <span>Hello</span>
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, -10, 20, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, repeatDelay: 2 }}
              className="inline-block origin-bottom-center"
              aria-label="wave"
            >
              👋
            </motion.span>
          </div>
          <motion.div
            initial={{ clipPath: "polygon(0 -10%, 0 110%, 0 110%, 0 -10%)" }}
            animate={{
              clipPath: "polygon(0 -10%, 100% -10%, 100% 110%, 0 110%)",
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            whileHover={{ scale: 1.04, color: "var(--tw-prose-primary)" }}
            className="text-4xl md:text-6xl font-extrabold text-muted-foreground mt-2 cursor-pointer"
          >
            I&apos;m Shreyans
          </motion.div>
        </div>
        {/* Typing effect for skills */}
        <div className="text-lg md:text-2xl font-mono text-primary bg-muted rounded px-3 py-1 min-h-[2.5rem] shadow-inner border border-border">
          <span>{showSkill}</span>
          <span className="animate-pulse">|</span>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <a
              href="https://github.com/mrvedmutha"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </Button>
          <Button asChild size="lg" className="gap-2">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="w-5 h-5" />
              Resume
            </a>
          </Button>
        </div>
      </div>
      {/* Right Tech Stack Logos Grid */}
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <TechStackGrid />
      </div>
    </section>
  );
}
