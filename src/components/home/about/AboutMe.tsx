"use client";
import React from "react";

export default function AboutMe() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 items-stretch">
      {/* Block 1: About Me Intro */}
      <div className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]">
        <h2 className="text-2xl font-bold mb-2">About Me</h2>
        <p className="text-muted-foreground text-base md:text-lg">
          {/* Dynamic content will go here */}
          Hi! I&apos;m Shreyans, a passionate developer and creative
          technologist. (Dynamic content placeholder)
        </p>
      </div>
      {/* Block 2: Fun Facts or Skills */}
      <div className="flex-1 bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]">
        <h2 className="text-2xl font-bold mb-2">More About Me</h2>
        <p className="text-muted-foreground text-base md:text-lg">
          {/* Dynamic content will go here */}I love building interactive web
          experiences and exploring new tech. (Dynamic content placeholder)
        </p>
      </div>
    </section>
  );
}
