"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton, TabButton } from "@/components/home/ui/buttons";
import { IEducation } from "@/types/admin/pages/education.types";
import { IExperience } from "@/types/admin/pages/experience.types";
import { GraduationCap, Briefcase } from "lucide-react";

interface EducationModalProps {
  education: IEducation | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ExperienceModalProps {
  experience: IExperience | null;
  isOpen: boolean;
  onClose: () => void;
}

function EducationModal({ education, isOpen, onClose }: EducationModalProps) {
  if (!education) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            {education.educationName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 text-lg">Institute</h4>
            <p className="text-gray-600">{education.instituteName}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-lg">Duration</h4>
            <p className="text-gray-600">{education.fromYear} - {education.toYear}</p>
          </div>

          {education.description && (
            <div>
              <h4 className="font-semibold mb-2 text-lg">Description</h4>
              <p className="text-gray-600 leading-relaxed">{education.description}</p>
            </div>
          )}

          {education.tags && education.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-lg">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {education.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-brand-yellow/10 text-brand-green px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExperienceModal({ experience, isOpen, onClose }: ExperienceModalProps) {
  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            {experience.jobTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 text-lg">Company</h4>
            <p className="text-gray-600">{experience.companyName}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-lg">Duration</h4>
            <p className="text-gray-600">
              {new Date(experience.fromDate).getFullYear()} - {experience.currentlyWorking ? 'Present' : new Date(experience.toDate || '').getFullYear()}
            </p>
          </div>

          {experience.aboutCompany && (
            <div>
              <h4 className="font-semibold mb-2 text-lg">About Company</h4>
              <p className="text-gray-600 leading-relaxed">{experience.aboutCompany}</p>
            </div>
          )}

          {experience.responsibilities && (
            <div>
              <h4 className="font-semibold mb-2 text-lg">Responsibilities</h4>
              <p className="text-gray-600 leading-relaxed">{experience.responsibilities}</p>
            </div>
          )}

          {experience.tags && experience.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 text-lg">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-brand-yellow/10 text-brand-green px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EducationExperienceSection() {
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEducation, setSelectedEducation] = useState<IEducation | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<IExperience | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [educationRes, experienceRes] = await Promise.all([
          fetch("https://mrvedmutha.com/api/v1/admin/education"),
          fetch("https://mrvedmutha.com/api/v1/admin/experience")
        ]);

        const [educationData, experienceData] = await Promise.all([
          educationRes.json(),
          experienceRes.json()
        ]);

        if (educationData.success && educationData.data?.data) {
          // Sort by year (latest first)
          const sortedEducations = educationData.data.data
            .sort((a: IEducation, b: IEducation) => parseInt(b.toYear) - parseInt(a.toYear))
            .slice(0, 4);
          setEducations(sortedEducations);
        }

        if (experienceData.success && experienceData.data?.data) {
          // Sort by date, current positions first, then by latest date
          const sortedExperiences = experienceData.data.data
            .sort((a: IExperience, b: IExperience) => {
              if (a.currentlyWorking && !b.currentlyWorking) return -1;
              if (!a.currentlyWorking && b.currentlyWorking) return 1;
              return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
            })
            .slice(0, 3);
          setExperiences(sortedExperiences);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleEducationClick = (education: IEducation) => {
    setSelectedEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleExperienceClick = (experience: IExperience) => {
    setSelectedExperience(experience);
    setIsExperienceModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-40 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="border border-[#cecece] bg-[#f5f5f5] p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                  ))}
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-brand-yellow"></div>
            <span className="text-gray-600 font-medium">Education & Work</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-black">My </span>
            <span className="text-brand-yellow italic">Academic and Professional</span>
            <span className="text-black"> Journey</span>
          </h2>
        </div>

        {/* Education and Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="border border-[#cecece] bg-[#f5f5f5] p-6 h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">Education</h3>
                </div>

                <div className="space-y-4">
                  {educations.map((education, index) => (
                    <motion.div
                      key={education._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between p-4 bg-white/70 rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h4 className="font-semibold text-black leading-tight">
                          {education.instituteName}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {education.educationName}
                        </p>
                      </div>
                      <TabButton
                        size="md"
                        onClick={() => handleEducationClick(education)}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <PrimaryButton
                    size="md"
                    onClick={() => window.location.href = "/education"}
                    className="bg-brand-green text-white hover:bg-brand-green/90"
                  >
                    View All
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border border-[#cecece] bg-[#f5f5f5] p-6 h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">Work Experience</h3>
                </div>

                <div className="space-y-4">
                  {experiences.map((experience, index) => (
                    <motion.div
                      key={experience._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-3"
                    >
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(experience.fromDate).getFullYear()}-{experience.currentlyWorking ? 'Present' : new Date(experience.toDate || '').getFullYear()}
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg border border-gray-200/50 hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-semibold text-black leading-tight">
                            {experience.jobTitle}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {experience.companyName}
                          </p>
                        </div>
                        <TabButton
                          size="md"
                          onClick={() => handleExperienceClick(experience)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <PrimaryButton
                    size="md"
                    onClick={() => window.location.href = "/experience"}
                    className="bg-brand-green text-white hover:bg-brand-green/90"
                  >
                    View All
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Education Modal */}
      <EducationModal
        education={selectedEducation}
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
      />

      {/* Experience Modal */}
      <ExperienceModal
        experience={selectedExperience}
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
      />
    </>
  );
}