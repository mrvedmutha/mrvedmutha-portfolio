"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutMe() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchSection() {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/admin/sections");
        const data = res.data?.data?.data?.[0];
        setSection(data || null);
      } catch {
        setSection(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSection();
  }, []);

  function getAge(dob) {
    if (!dob) return null;
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (isNaN(birthYear)) return null;
    return currentYear - birthYear;
  }

  return (
    <>
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        About Me
      </h2>
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
          <div className="text-muted-foreground text-base md:text-lg">
            {loading && "Loading..."}
            {!loading && section && (
              <div className="flex flex-col gap-2">
                <div>
                  <strong>Name:</strong> {section.name}
                </div>
                <div>
                  <strong>Current City:</strong> {section.currentCity}
                </div>
                <div>
                  <strong>Country:</strong> {section.country}
                </div>
                <div>
                  <strong>Degree:</strong> {section.degree}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {section.dob}
                </div>
                <div>
                  <strong>Age:</strong> {getAge(section.dob)} years
                </div>
              </div>
            )}
            {!loading && !section && <span>No information available.</span>}
          </div>
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
          <div className="text-muted-foreground text-base md:text-lg">
            {loading && "Loading..."}
            {!loading && section && section.about}
            {!loading && (!section || !section.about) && (
              <span>No about information available.</span>
            )}
          </div>
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
