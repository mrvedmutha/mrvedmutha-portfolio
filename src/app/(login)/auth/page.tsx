import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to your account
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
