"use client";
import NewSocialForm from "@/components/admin/pages/socials/NewSocialForm";

export default function NewSocialPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Create Social</h1>
        <NewSocialForm
          onSubmit={(data) => {
            // For now, just log the data
            console.log("Social created:", data);
          }}
        />
      </div>
    </div>
  );
}
