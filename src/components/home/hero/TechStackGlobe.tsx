"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogoBillboard({
  src,
  alt,
  position,
  camera,
  onHover,
  onUnhover,
  hovered,
}: any) {
  // Billboard: always face the camera
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current && camera) {
      ref.current.lookAt(camera.position);
    }
  });
  // Fade/scale based on Z-depth
  const z = position[2];
  const scale = 0.9 + 0.7 * ((z + 2.5) / 5); // scale from 0.9 to 1.6
  const opacity = 0.5 + 0.5 * ((z + 2.5) / 5); // fade from 0.5 to 1
  return (
    <group ref={ref} position={position}>
      <Html
        center
        style={{ pointerEvents: "auto", opacity, transform: `scale(${scale})` }}
      >
        <img
          src={src}
          alt={alt}
          width={48}
          height={48}
          style={{
            filter: hovered ? "drop-shadow(0 0 12px #6366f1)" : undefined,
            transition: "filter 0.2s, opacity 0.2s, transform 0.2s",
            opacity,
            transform: `scale(${scale})`,
            cursor: "pointer",
            background: "#fff",
            borderRadius: 8,
            boxSizing: "border-box",
          }}
          onMouseEnter={onHover}
          onMouseLeave={onUnhover}
          draggable={false}
        />
        {hovered && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-background/80 text-xs rounded shadow border border-border z-10">
            {alt}
          </div>
        )}
      </Html>
    </group>
  );
}

function TagCloud({
  setHoveredAlt,
}: {
  setHoveredAlt: (alt: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Distribute logos evenly on a sphere
  const radius = 2.5;
  const logoPositions = logos.map((_, i, arr) => {
    const phi = Math.acos(-1 + (2 * i) / arr.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi),
    ];
  });

  // Auto-rotate
  useFrame(() => {
    if (group.current && !dragging) {
      group.current.rotation.y += 0.003;
    }
  });

  // Drag to rotate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerDown = (e: any) => {
    setDragging(true);
    setLastX(e.clientX);
  };
  const handlePointerUp = () => setDragging(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerMove = (e: any) => {
    if (dragging && group.current) {
      const deltaX = e.clientX - lastX;
      group.current.rotation.y += deltaX * 0.01;
      setLastX(e.clientX);
    }
  };

  return (
    <group
      ref={group}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      {logos.map((logo, i) => (
        <LogoBillboard
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          position={logoPositions[i]}
          camera={camera}
          hovered={hoveredIdx === i}
          onHover={() => {
            setHoveredIdx(i);
            setHoveredAlt(logo.alt);
          }}
          onUnhover={() => {
            setHoveredIdx(null);
            setHoveredAlt(null);
          }}
        />
      ))}
    </group>
  );
}

export default function TechStackGlobe() {
  const [hoveredAlt, setHoveredAlt] = useState<string | null>(null);
  return (
    <div className="w-full h-[350px] md:h-[400px] flex items-center justify-center relative select-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <TagCloud setHoveredAlt={setHoveredAlt} />
      </Canvas>
      {/* Alt text overlay for accessibility (optional) */}
      {hoveredAlt && (
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2 px-3 py-1 bg-background/90 text-xs rounded shadow border border-border z-20 pointer-events-none">
          {hoveredAlt}
        </div>
      )}
    </div>
  );
}
