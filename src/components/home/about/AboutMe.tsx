"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutMe() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1200); // 1.2s delay for demo, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-stretch"
      >
        {/* Block 1: About Me Intro */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
        >
          <h2 className="text-2xl font-bold mb-5">About Me</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {/* Dynamic content will go here */}
            Hi! I&apos;m Shreyans, a passionate developer and creative
            technologist. (Dynamic content placeholder)
          </p>
        </motion.div>
        {/* Block 2: Fun Facts or Skills */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
        >
          <h2 className="text-2xl font-bold mb-2">More About Me</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {/* Dynamic content will go here */}I love building interactive web
            experiences and exploring new tech. (Dynamic content placeholder)
          </p>
        </motion.div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-4 py-8 mt-0 flex flex-col md:flex-row gap-8 items-stretch"
      >
        {/* Left: DevCard Image (35% on md+, 100% on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="w-full md:flex-[0_0_35%] md:max-w-[35%] flex items-center justify-center bg-muted rounded-xl shadow p-6 border border-border min-h-[220px]"
        >
          <a
            href="https://app.daily.dev/mrvedmutha"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            {imageLoaded ? (
              <Image
                src="https://api.daily.dev/devcards/v2/B18UDambwv8Sw8pdumYmh.png?type=wide&r=6xe"
                alt="Shreyans Jain's Dev Card"
                width={652}
                height={200}
                className="rounded-lg shadow-lg w-full h-auto"
                priority
              />
            ) : (
              <Skeleton className="w-full h-[200px] rounded-lg" />
            )}
          </a>
        </motion.div>
        {/* Right: Dynamic Content Placeholder (65% on md+, 100% on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="w-full md:flex-1 flex items-center justify-center bg-muted rounded-xl shadow p-8 border border-border min-h-[220px]"
        >
          {/* Dynamic content will go here */}
          <span className="text-muted-foreground text-base md:text-lg">
            Dynamic content coming soon...
          </span>
        </motion.div>
      </motion.section>
    </>
  );
}
