"use client";
import React, { useRef } from "react";

const logos = [
  { src: "/assets/home/logo/tech-stack-softwares/png/html5.png", alt: "HTML5" },
  { src: "/assets/home/logo/tech-stack-softwares/png/css3.png", alt: "CSS3" },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/javascript.png",
    alt: "JavaScript",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/nodejs.png",
    alt: "Node.js",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/nextjs-black.png",
    alt: "Next.js",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/mongodb.png",
    alt: "MongoDB",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/photoshop.png",
    alt: "Photoshop",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/illustrator.png",
    alt: "Illustrator",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/after-effects.png",
    alt: "After Effects",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/premiere-pro.png",
    alt: "Premiere Pro",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/google-ads.png",
    alt: "Google Ads",
  },
  { src: "/assets/home/logo/tech-stack-softwares/png/meta.png", alt: "Meta" },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/amazon.png",
    alt: "Amazon",
  },
  {
    src: "/assets/home/logo/tech-stack-softwares/png/rest-api.png",
    alt: "REST API",
  },
];

export default function TechStackMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Pause animation on hover
  const handleMouseEnter = () => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = () => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "running";
  };

  // Duplicate logos for seamless loop
  const allLogos = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-x-hidden py-4">
      <div
        ref={marqueeRef}
        className="flex gap-8 animate-marquee whitespace-nowrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ animationDuration: "28s" }}
      >
        {allLogos.map(({ src, alt }, i) => (
          <div
            key={i}
            className="relative group flex items-center justify-center"
          >
            <img
              src={src}
              alt={alt}
              width={48}
              height={48}
              className="transition-transform duration-200 hover:scale-110 drop-shadow-md cursor-pointer bg-white rounded p-1"
              draggable={false}
            />
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background/90 text-xs rounded shadow border border-border z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
              {alt}
            </span>
          </div>
        ))}
      </div>
      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
