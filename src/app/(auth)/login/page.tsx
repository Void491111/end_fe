import { Card } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in untuk akses sistem kasir
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 MooisteCafe · All rights reserved
        </p>
      </Card>
    </div>
  );
}