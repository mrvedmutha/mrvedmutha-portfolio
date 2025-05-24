import { SignOutButton } from "@/components/auth/SignOutButton";

export default function AdminPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, you are logged in as admin.</p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </main>
  );
}
