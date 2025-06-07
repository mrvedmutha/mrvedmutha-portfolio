"use client";
import React, { useEffect, useState } from "react";
import { getEducations, Education } from "@/context/constants/home/education";
import { School, GraduationCap, ScrollText, BookOpen } from "lucide-react";

const educationTypeIcons: Record<string, React.ElementType> = {
  School,
  College: GraduationCap,
  Certification: ScrollText,
  Diploma: BookOpen,
};

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducations().then((data) => {
      setEducations(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
          Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educations.map((edu) => {
            const Icon = educationTypeIcons[edu.educationType] || School;
            return (
              <div
                key={edu._id}
                className="bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
              >
                {/* Title with Icon */}
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-7 h-7 text-primary" />
                  <span className="text-xl font-bold">{edu.educationName}</span>
                </div>
                {/* Institute and Years */}
                <div className="text-sm text-muted-foreground mb-2">
                  {edu.instituteName} &middot; {edu.fromYear} - {edu.toYear}
                </div>
                {/* Description */}
                {edu.description && (
                  <div className="mb-2 text-base text-muted-foreground">
                    {edu.description}
                  </div>
                )}
                {/* Tags */}
                {edu.tags && edu.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                    {edu.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-background px-2 py-1 rounded text-xs border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
