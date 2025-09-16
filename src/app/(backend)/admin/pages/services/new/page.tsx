import NewServiceForm from "@/components/admin/pages/services/NewServiceForm";

export default function NewServicePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
        <NewServiceForm />
      </div>
    </main>
  );
}