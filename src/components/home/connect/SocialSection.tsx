"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSocials, SocialLink } from "@/context/constants/home/socials";
import { IconMap } from "@/context/constants/socials";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

export default function SocialSection() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSocials().then((data) => {
      setSocials(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-brand-yellow"></div>
            <span className="text-gray-600 font-medium">Let&apos;s Catch Up</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-brand-yellow italic">Connect</span>
            <span className="text-black"> with Me</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[160px] w-full max-w-xs rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-0.5 bg-brand-yellow"></div>
          <span className="text-gray-600 font-medium">Let&apos;s Catch Up</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold">
          <span className="text-brand-yellow italic">Connect</span>
          <span className="text-black"> with Me</span>
        </h2>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
        {socials.map((social, idx) => (
          <motion.div
            key={social._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="w-full max-w-xs bg-muted rounded-xl shadow p-8 flex flex-col items-start border border-border min-h-[160px] hover:scale-105 hover:shadow-lg transition-transform cursor-pointer group"
          >
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 mb-2 no-underline"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                <SocialIcon
                  url={social.url}
                  as="span"
                  style={{ height: 32, width: 32 }}
                />
              </span>
              <span className="text-xl font-semibold text-muted-foreground">
                {social.name}
              </span>
            </Link>
            <span className="text-base text-primary font-medium mb-1">
              {social.username}
            </span>
            <span className="text-xs text-muted-foreground break-all">
              {social.url.replace(/^https?:\/\//, "")}
            </span>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
