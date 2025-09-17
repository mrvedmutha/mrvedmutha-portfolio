import ContactUsForm from "@/components/home/contactus/ContactUsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Let's Connect & Collaborate",
  description: "Ready to collaborate on creative projects? Whether you need Web Development, Graphic Design, Video Editing, Digital Marketing, or Amazon PPC services, let's discuss your ideas and bring them to life.",
  keywords: ["Contact", "Collaboration", "Creative Services", "Web Development Services", "Graphic Design", "Video Editing Services", "Digital Marketing", "Amazon PPC Consultant", "Freelance", "Project Discussion"],
  openGraph: {
    title: "Contact - Let's Connect & Collaborate | Mrvedmutha",
    description: "Ready to collaborate on creative projects across multiple disciplines? Let's connect!",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Let's Connect & Collaborate | Mrvedmutha",
    description: "Ready to collaborate on creative projects across multiple disciplines? Let's connect!",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-green flex items-center justify-center py-16">
      <div className="w-full max-w-7xl mx-auto px-6">
        <ContactUsForm />
      </div>
    </main>
  );
}
