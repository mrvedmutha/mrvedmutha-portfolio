"use client";
import React from "react";
import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import { getTechStackLogos } from "@/context/constants/home/hero";
import Image from "next/image";

export default function TechStackMarquee() {
  const [techStack, setTechStack] = React.useState<any[]>([]);

  // Fetch tech stack dynamically
  React.useEffect(() => {
    getTechStackLogos().then((data) => {
      setTechStack(data);
    });
  }, []);

  // Create a long string of tech stack items for continuous scrolling
  const marqueeContent = Array(3).fill([...techStack]).flat();

  return (
    <div className="w-full relative overflow-hidden py-8">
      {/* Green Skewed Stripe Background */}
      <div 
        className="absolute inset-0 bg-brand-green transform skew-y-2"
        style={{ transformOrigin: 'center center' }}
      ></div>
      
      {/* Yellow Stripe for Tech Stack */}
      <div 
        className="absolute inset-0 bg-brand-yellow mt-4 mb-4"
        style={{ 
          top: '20%',
          bottom: '20%'
        }}
      ></div>
      
      {/* Tech Stack Content */}
      <div className="relative z-10 py-4">
        <motion.div
          animate={{ x: [-2000, 500] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="whitespace-nowrap"
        >
          <div className="flex items-center gap-8">
            {marqueeContent.map((tech, index) => (
              <React.Fragment key={`${tech.name}-${index}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm">
                    <Image
                      src={tech.svg}
                      alt={tech.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-brand-green font-semibold text-lg">
                    {tech.name}
                  </span>
                </div>
                {index < marqueeContent.length - 1 && (
                  <Asterisk className="w-5 h-5 text-brand-green" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}