"use client";
import React, { useEffect, useState } from "react";
import { getProjects, Project } from "@/context/constants/home/projects";
import { motion } from "framer-motion";
import { CodeXml, Brush, Github, ExternalLink } from "lucide-react";

const typeIconMap: Record<string, React.ElementType> = {
  code: CodeXml,
  graphic: Brush,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data.reverse());
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
            Projects
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
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const TypeIcon = typeIconMap[project.type] || CodeXml;
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: 0.1 * idx,
                }}
                className="bg-muted rounded-xl shadow p-8 flex flex-col justify-center items-start border border-border min-h-[220px]"
              >
                {/* Title + Type Icon */}
                <div className="flex items-center gap-4 mb-2">
                  {React.createElement(TypeIcon, {
                    className: "w-10 h-10 text-primary",
                  })}
                  <span className="text-2xl font-bold">{project.title}</span>
                </div>
                {/* Description */}
                <div className="text-muted-foreground text-base md:text-lg mb-3">
                  {project.description}
                </div>
                {/* Techstack */}
                {project.techstack && project.techstack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                    {project.techstack.map((tool) => (
                      <span
                        key={tool.name}
                        className="flex items-center gap-1 bg-background px-2 py-1 rounded text-xs border border-border"
                      >
                        <img
                          src={tool.svg}
                          alt={tool.name}
                          title={tool.name}
                          className="w-5 h-5 object-contain bg-white rounded"
                        />
                        {tool.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.type === "code" && project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Github className="w-4 h-4" /> GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  {project.type === "graphic" && project.behanceLink && (
                    <a
                      href={project.behanceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" /> Behance
                    </a>
                  )}
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" /> Demo
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
