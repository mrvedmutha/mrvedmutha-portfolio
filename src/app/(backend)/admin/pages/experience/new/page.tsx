"use client";
import { NewExperienceForm } from "@/components/admin/pages/experience/NewExperienceForm";

export default function ExperienceCreatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-2xl w-full p-6">
        <h1 className="text-2xl font-bold mb-6">Create Experience</h1>
        <NewExperienceForm />
      </div>
    </div>
  );
}
