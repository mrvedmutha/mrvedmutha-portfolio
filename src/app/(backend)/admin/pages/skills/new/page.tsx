import NewSkillForm from "@/components/admin/skills/NewSkillForm";

export default function NewSkillPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Add New Skill</h1>
        <NewSkillForm />
      </div>
    </main>
  );
}
