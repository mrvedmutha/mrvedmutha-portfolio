import { SignOutButton } from "@/components/auth/SignOutButton";
import ContactTable from "@/components/admin/pages/contact/ContactTable";

export default function AdminPage() {
  return (
    <main className="flex flex-col">
      <h1 className="text-3xl font-bold px-16 py-8">Admin Dashboard</h1>
      <ContactTable />
    </main>
  );
}
