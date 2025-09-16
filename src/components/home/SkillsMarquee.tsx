"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getHeroSkills } from "@/context/constants/home/hero";

export default function SkillsMarquee() {
  const [skills, setSkills] = React.useState<string[]>([]);

  // Fetch skills dynamically
  React.useEffect(() => {
    getHeroSkills().then(setSkills);
  }, []);

  // Take first 6 skills or use defaults if API fails
  const displaySkills = skills.length > 0 
    ? skills.slice(0, 6)
    : ['App Design', 'Website Design', 'Dashboard', 'Wireframe', 'UI/UX Design', 'Mobile Design'];

  // Create a long string of skills for continuous scrolling
  const marqueeContent = Array(4).fill([...displaySkills]).flat().join(' ★ ') + ' ★ ';

  return (
    <div className="w-full relative overflow-hidden bg-brand-yellow py-3">
      {/* Green stripe accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 to-transparent"></div>
      
      {/* Scrolling text with Framer Motion */}
      <div className="relative">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="whitespace-nowrap"
        >
          <span className="text-brand-green font-semibold text-lg inline-flex items-center gap-4">
            {marqueeContent.split(' ★ ').map((skill, index) => (
              <React.Fragment key={index}>
                <span>{skill}</span>
                {index < marqueeContent.split(' ★ ').length - 1 && (
                  <Star className="w-4 h-4 text-brand-green fill-current" />
                )}
              </React.Fragment>
            ))}
          </span>
        </motion.div>
      </div>

    </div>
  );
}