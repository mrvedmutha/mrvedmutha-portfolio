"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSocials, SocialLink } from "@/context/constants/home/socials";
import { SocialIcon } from "react-social-icons";
import Link from "next/link";

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
      <section className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
          Connect with me
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[160px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4 pb-8"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
        Connect with me
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
        {socials.map((social, idx) => (
          <motion.a
            key={social._id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 * idx }}
            className="w-full max-w-xs bg-muted rounded-xl shadow p-8 flex flex-col items-start border border-border min-h-[160px] hover:scale-105 hover:shadow-lg transition-transform cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                <SocialIcon
                  url={social.url}
                  style={{ height: 32, width: 32 }}
                />
              </span>
              <span className="text-xl font-semibold text-muted-foreground">
                {social.name}
              </span>
            </div>
            <span className="text-base text-primary font-medium mb-1">
              {social.username}
            </span>
            <span className="text-xs text-muted-foreground break-all">
              {social.url.replace(/^https?:\/\//, "")}
            </span>
          </motion.a>
        ))}
      </div>
      <div className="flex flex-col items-center mt-12 gap-4">
        <span className="text-lg font-medium text-muted-foreground">
          Reaching out Quick?
        </span>
        <Link href="/contact">
          <button className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
            Contact Us
          </button>
        </Link>
      </div>
    </motion.section>
  );
}
