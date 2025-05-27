import NewProjectForm from "@/components/admin/pages/projects/NewProjectForm";

export default function CreateProjectPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-2xl w-full p-6">
        <h1 className="text-2xl font-bold mb-6">Create Project</h1>
        <NewProjectForm />
      </div>
    </div>
  );
}
