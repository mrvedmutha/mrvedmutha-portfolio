"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 items-stretch"
    >
      {/* Block 1: About Me Intro */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
      >
        <h2 className="text-2xl font-bold mb-2">About Me</h2>
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
  );
}
