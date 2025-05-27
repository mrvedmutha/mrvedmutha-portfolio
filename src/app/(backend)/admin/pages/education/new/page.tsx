"use client";
import { NewEducationForm } from "@/components/admin/pages/education/NewEducationForm";

export default function CreateEducationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Create Education</h1>
        <NewEducationForm />
      </div>
    </div>
  );
}
