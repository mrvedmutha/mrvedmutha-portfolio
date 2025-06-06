"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getTechStackLogos } from "@/context/constants/home/hero";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechStackGrid() {
  const [logos, setLogos] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    getTechStackLogos().then((data) => {
      setLogos(
        data.map((logo: any) => ({
          src: logo.svg, // adjust if your API uses a different property
          alt: logo.name,
        }))
      );
    });
  }, []);

  const animParams = useMemo(
    () =>
      logos.map(() => ({
        delay: getRandomFloat(0, 2),
        duration: getRandomFloat(2.5, 4.5),
        xAmp: getRandomFloat(8, 24) * getRandomSign(),
        yAmp: getRandomFloat(8, 24) * getRandomSign(),
        scaleMin: getRandomFloat(0.92, 0.98),
        scaleMax: getRandomFloat(1.08, 1.16),
      })),
    [logos]
  );

  if (logos.length === 0) {
    // Skeleton grid for loading state
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 w-full max-w-2xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-14 h-14 bg-muted rounded-lg shadow p-2"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 w-full max-w-2xl mx-auto"
    >
      {logos.map((logo, i) => {
        const { delay, duration, xAmp, yAmp, scaleMin, scaleMax } =
          animParams[i];
        return (
          <motion.div
            key={logo.src}
            variants={item}
            whileHover={{ scale: 1.15, zIndex: 2 }}
            animate={{
              scale: [1, scaleMax, scaleMin, 1],
              x: [0, xAmp, -xAmp, 0],
              y: [0, yAmp, -yAmp, 0],
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration,
                delay,
                ease: "easeInOut",
              },
            }}
            className="relative flex flex-col items-center group"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={56}
              height={56}
              className="bg-white rounded-lg shadow p-2 transition-transform duration-200 cursor-pointer"
              draggable={false}
              unoptimized
              priority
            />
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background/90 text-xs rounded shadow border border-border z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
              {logo.alt}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Animation helpers and configs
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}
