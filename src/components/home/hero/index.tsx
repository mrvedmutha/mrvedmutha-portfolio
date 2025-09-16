"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, FileText, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHeroSkills } from "@/context/constants/home/hero";
import TechStackGrid from "./TechStackGrid";
import Image from "next/image";

export default function Hero() {
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillIndex, setSkillIndex] = React.useState(0);
  const [showSkill, setShowSkill] = React.useState("");
  const [typing, setTyping] = React.useState(true);

  // Fetch skills dynamically
  React.useEffect(() => {
    getHeroSkills().then(setSkills);
  }, []);

  // Typing and erasing effect for skills
  React.useEffect(() => {
    if (skills.length === 0) return;
    let timeout: NodeJS.Timeout;
    const currentSkill = skills[skillIndex] || "";
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
    <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[80vh]">
      {/* Left Side - Profile Image with Skills */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-96 h-96 flex items-center justify-center">
          {/* Profile Image with Built-in Yellow Circle */}
          <div className="relative w-96 h-96 shadow-2xl">
            <Image
              src="/assets/mrvedmutha-image/mrvedmutha-photo-in-circle.png"
              alt="Mr.Vedmutha Profile"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Right Side - Content */}
      <div className="flex-1 flex flex-col items-start justify-center gap-6">
        <div className="text-brand-mutedText text-lg font-medium">About Me</div>
        
        <div className="relative select-none">
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-darkText leading-tight">
            Who is{" "}
            <span className="text-brand-yellow">Mr.Vedmutha?</span>
          </h1>
        </div>
        
        <p className="text-brand-mutedText text-lg leading-relaxed max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
          ad minim veniam, quis nostrud exercitation ullamco.
        </p>
        
        {/* Statistics */}
        <div className="flex flex-wrap gap-8 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-darkText">600+</div>
            <div className="text-brand-mutedText text-sm">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-darkText">50+</div>
            <div className="text-brand-mutedText text-sm">Industries Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-darkText">10+</div>
            <div className="text-brand-mutedText text-sm">Years of Experience</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button 
            className="btn-secondary gap-2 px-6 py-3"
            style={{ backgroundColor: '#4A6034', color: '#FFFFFF' }}
          >
            Download CV
            <ArrowDownRight className="w-5 h-5" />
          </Button>
          <Button 
            asChild
            variant="outline" 
            className="gap-2 px-6 py-3 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          >
            <a
              href="https://github.com/mrvedmutha"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
