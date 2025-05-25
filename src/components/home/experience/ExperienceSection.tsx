"use client";
import React from "react";
import { motion } from "framer-motion";
import { Experience } from "@/context/constants/home/experience";

export default function ExperienceSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        Experience
      </h2>
      <div className="flex flex-col gap-8 items-stretch">
        {[0, 1].map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-col md:flex-row gap-8 items-stretch"
          >
            {Experience.slice(rowIdx * 3, rowIdx * 3 + 3).map((exp, idx) => (
              <motion.div
                key={exp.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: 0.1 * (idx + 1 + rowIdx * 3),
                }}
                className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
              >
                <h2 className="text-2xl font-bold mb-2">Experience</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  {exp.icon} {exp.name}
                </p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
          Show more...
        </button>
      </div>
    </motion.section>
  );
}
