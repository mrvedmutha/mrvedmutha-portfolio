"use client";
import React from "react";
import Image from "next/image";

export default function AboutDevCardSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 mt-0 flex flex-col md:flex-row gap-8 items-stretch">
      {/* Left: DevCard Image (35% on md+, 100% on mobile) */}
      <div className="w-full md:flex-[0_0_35%] md:max-w-[35%] flex items-center justify-center bg-muted rounded-xl shadow p-6 border border-border min-h-[220px]">
        <a
          href="https://app.daily.dev/mrvedmutha"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Image
            src="https://api.daily.dev/devcards/v2/B18UDambwv8Sw8pdumYmh.png?type=wide&r=6xe"
            alt="Shreyans Jain's Dev Card"
            width={652}
            height={200}
            className="rounded-lg shadow-lg w-full h-auto"
            priority
          />
        </a>
      </div>
      {/* Right: Dynamic Content Placeholder (65% on md+, 100% on mobile) */}
      <div className="w-full md:flex-1 flex items-center justify-center bg-muted rounded-xl shadow p-8 border border-border min-h-[220px]">
        {/* Dynamic content will go here */}
        <span className="text-muted-foreground text-base md:text-lg">
          Dynamic content coming soon...
        </span>
      </div>
    </section>
  );
}
