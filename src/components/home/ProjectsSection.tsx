"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton, LinkButton } from "@/components/home/ui/buttons";
import { ExternalLink, Github } from "lucide-react";
import { IProject } from "@/types/admin/pages/project.types";
import Image from "next/image";

interface ProjectModalProps {
  project: IProject | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Project Image */}
          {project.image && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Project Description */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">About This Project</h4>
            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.techstack && project.techstack.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-lg">Tech Stack</h4>
              <div className="flex flex-wrap gap-3">
                {project.techstack.map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm"
                  >
                    <img
                      src={tech.svg}
                      alt={tech.name}
                      width={20}
                      height={20}
                    />
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Demo
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.behanceLink && (
              <a
                href={project.behanceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Behance
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("https://mrvedmutha.com/api/v1/admin/projects?limit=4");
        const data = await response.json();
        if (data.success && data.data?.data) {
          // Sort by creation date (latest first) and take only 4
          const sortedProjects = data.data.data
            .sort((a: IProject, b: IProject) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 4);
          setProjects(sortedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleSeeMore = (project: IProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-8 h-0.5" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-12 w-80" />
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-full border border-[#cecece] bg-[#f5f5f5]">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-48 rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-brand-yellow"></div>
              <span className="text-gray-600 font-medium">These Are My Works</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold">
              <span className="text-black">Latest </span>
              <span className="text-brand-yellow italic">Projects</span>
            </h2>
          </div>

          <PrimaryButton size="lg" onClick={() => window.location.href = "/projects"}>
            All Projects
          </PrimaryButton>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-[#cecece] bg-[#f5f5f5] overflow-hidden">
                <CardContent className="p-0">
                  {/* Project Image */}
                  <div className="relative w-full h-48 bg-gray-200">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-4">
                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-black leading-tight">
                      {project.title}
                    </h3>

                    {/* See More Link */}
                    <div className="pt-2">
                      <LinkButton
                        onClick={() => handleSeeMore(project)}
                        size="sm"
                      >
                        See More
                      </LinkButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Projects State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects available at the moment.</p>
          </div>
        )}
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}