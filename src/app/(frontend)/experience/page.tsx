"use client";
import React, { useEffect, useState } from "react";
import {
  getExperiences,
  Experience as ExperienceType,
} from "@/context/constants/home/experience";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    getExperiences().then((data) => {
      setExperiences(
        data.sort(
          (a, b) =>
            new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
        )
      );
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mt-16 mb-8 text-center w-full">
            Experience
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
          Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp._id}
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
              {/* Job Title & Company */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <span className="text-xl font-bold">{exp.jobTitle}</span>
                <span className="text-muted-foreground">
                  @ {exp.companyName}
                </span>
              </div>
              {/* Dates */}
              <div className="text-sm text-muted-foreground mb-2">
                {format(new Date(exp.fromDate), "MMM-yy")} -{" "}
                {exp.currentlyWorking
                  ? "Present"
                  : exp.toDate
                  ? format(new Date(exp.toDate), "MMM-yy")
                  : ""}
              </div>
              {/* About Company */}
              {exp.aboutCompany && (
                <div className="mb-2 text-base text-muted-foreground">
                  {exp.aboutCompany}
                </div>
              )}
              {/* Tags */}
              {exp.tags && exp.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-background px-2 py-1 rounded text-xs border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Read More Dialog */}
              {(exp.responsibilities || exp.aboutCompany) && (
                <Dialog
                  open={openDialog === exp._id}
                  onOpenChange={(open) => setOpenDialog(open ? exp._id : null)}
                >
                  <DialogTrigger asChild>
                    <button className="mt-2 px-4 py-1 rounded bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
                      Read more
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {exp.jobTitle} @ {exp.companyName}
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="mb-2 text-sm text-muted-foreground">
                        {format(new Date(exp.fromDate), "MMM-yy")} -{" "}
                        {exp.currentlyWorking
                          ? "Present"
                          : exp.toDate
                          ? format(new Date(exp.toDate), "MMM-yy")
                          : ""}
                      </div>
                      {exp.aboutCompany && (
                        <div className="mb-2">
                          <strong>About Company:</strong> {exp.aboutCompany}
                        </div>
                      )}
                      {exp.responsibilities && (
                        <div className="mb-2">
                          <strong>Responsibilities:</strong>
                          <div className="whitespace-pre-line mt-1">
                            {exp.responsibilities}
                          </div>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
